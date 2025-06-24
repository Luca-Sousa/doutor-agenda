// types/auth.d.ts
import "better-auth";

declare module "better-auth" {
    interface User {
      id: string;
      name?: string;
      email: string;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
      image?: string | undefined;
      plan?: string;
      clinics: Array<{ id: string; name?: string }>;
      activeClinicId?: string;
    }

  interface Session {
    user: User;
  }
}
