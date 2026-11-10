import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const computed = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return computed === hash;
  }

  async signUp(data: {
    name: string;
    email: string;
    password: string;
    workspaceName: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = this.hashPassword(data.password);

    // Create user and initial workspace in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          passwordHash,
          emailVerifiedAt: new Date(), // Auto-verified for seamless MVP onboarding
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: data.workspaceName.trim(),
          ownerId: user.id,
          defaultExpiryDays: 14,
          defaultReminderHours: 48,
          members: {
            create: {
              userId: user.id,
              role: 'ADMIN',
              acceptedAt: new Date(),
            },
          },
        },
      });

      return { user, workspace };
    });

    const token = this.jwtService.sign({
      sub: result.user.id,
      email: result.user.email,
      workspaceId: result.workspace.id,
      role: 'ADMIN',
    });

    return {
      accessToken: token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
      workspace: {
        id: result.workspace.id,
        name: result.workspace.name,
        role: 'ADMIN',
      },
    };
  }

  async signIn(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
      include: {
        memberships: {
          include: { workspace: true },
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Support demo salt format from seed or pbkdf2 format
    let isMatch = false;
    if (user.passwordHash.startsWith('signdesk_demo_salt:')) {
      const [, hash] = user.passwordHash.split(':');
      const testHash = crypto.createHash('sha256').update(`${data.password}signdesk_demo_salt`).digest('hex');
      isMatch = testHash === hash;
    } else {
      isMatch = this.verifyPassword(data.password, user.passwordHash);
    }

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const membership = user.memberships[0];
    const workspaceId = membership ? membership.workspaceId : null;
    const role = membership ? membership.role : 'SENDER';

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      workspaceId,
      role,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      workspace: membership
        ? {
            id: membership.workspace.id,
            name: membership.workspace.name,
            role: membership.role,
          }
        : null,
    };
  }

  async requestMagicLink(email: string) {
    const normalized = email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email: normalized } });
    // In MVP, return token directly for seamless testing/mock delivery
    const magicToken = crypto.randomBytes(24).toString('hex');
    return {
      success: true,
      message: 'Magic link dispatched to email',
      mockMagicLink: `/signin/magic?token=${magicToken}&email=${encodeURIComponent(normalized)}`,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: { workspace: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      memberships: user.memberships.map((m) => ({
        workspaceId: m.workspaceId,
        workspaceName: m.workspace.name,
        role: m.role,
      })),
    };
  }

  async updateProfile(userId: string, data: { name?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
      },
    });
  }
}
