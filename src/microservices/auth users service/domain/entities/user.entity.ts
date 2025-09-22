export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public isActive: boolean = true,
    public currentPoints: number = 0,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(email: string, password: string): User {
    const id = crypto.randomUUID();
    return new User(id, email, password);
  }

  updateEmail(newEmail: string): void {
    this.email = newEmail;
    this.updateTimestamp();
  }

  updatePassword(newPassword: string): void {
    this.password = newPassword;
    this.updateTimestamp();
  }

  addPoints(points: number): void {
    if (points < 0) {
      throw new Error('Points cannot be negative');
    }
    this.currentPoints += points;
    this.updateTimestamp();
  }

  deductPoints(points: number): void {
    if (points < 0) {
      throw new Error('Points cannot be negative');
    }
    if (this.currentPoints < points) {
      throw new Error('Insufficient points');
    }
    this.currentPoints -= points;
    this.updateTimestamp();
  }

  deactivate(): void {
    this.isActive = false;
    this.updateTimestamp();
  }

  activate(): void {
    this.isActive = true;
    this.updateTimestamp();
  }

  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}