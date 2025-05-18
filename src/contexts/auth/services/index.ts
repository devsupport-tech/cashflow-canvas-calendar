
import { loginService } from './loginService';
import { signupService } from './signupService';
import { passwordService } from './passwordService';
import { profileService } from './profileService';

// Combine all services into a single export
export const authService = {
  ...loginService,
  ...signupService,
  ...passwordService,
  ...profileService,
};
