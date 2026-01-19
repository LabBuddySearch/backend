export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface UserUpdateRequest {
  name: string;
  city: string;
  study: string;
  socialLinks: Record<string, string> | null;
}
