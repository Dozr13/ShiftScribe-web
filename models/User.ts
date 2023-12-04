export class User {
  id: string;
  displayName: string;
  email: string;
  organization: string;
  accessLevel: number;

  constructor(
    id: string,
    displayName: string,
    email: string,
    organization: string,
    accessLevel: number,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.email = email;
    this.organization = organization;
    this.accessLevel = accessLevel;
  }

  isAdmin(): boolean {
    return this.accessLevel === 4;
  }
}
