import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    // Instantiate with mock prisma and jwt
    authService = new AuthService({} as any, {} as any);
  });

  describe('Password Hashing', () => {
    it('hashes passwords with salt and verifies successfully', () => {
      const password = 'SecretPassword123!';
      const hash = authService.hashPassword(password);

      expect(hash).toContain(':');
      expect(authService.verifyPassword(password, hash)).toBe(true);
      expect(authService.verifyPassword('WrongPassword', hash)).toBe(false);
    });

    it('returns false for malformed hash strings', () => {
      expect(authService.verifyPassword('test', 'bad_format')).toBe(false);
    });
  });
});
