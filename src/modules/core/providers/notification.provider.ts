export interface NotificationPayload {
  to: string;
  subject?: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface NotificationProvider {
  sendSms(phone: string, message: string): Promise<boolean>;
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
  sendInApp(userId: string, title: string, body: string): Promise<boolean>;
}

export class ConsoleNotificationProvider implements NotificationProvider {
  async sendSms(phone: string, message: string): Promise<boolean> {
    console.log(`[Notification SMS -> +91${phone}]: ${message}`);
    return true;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    console.log(`[Notification EMAIL -> ${to}] Subject: ${subject}\n${body}`);
    return true;
  }

  async sendInApp(userId: string, title: string, body: string): Promise<boolean> {
    console.log(`[Notification IN-APP -> User ${userId}] ${title}: ${body}`);
    return true;
  }
}

let activeNotificationProvider: NotificationProvider | null = null;

export function getNotificationProvider(): NotificationProvider {
  if (!activeNotificationProvider) {
    activeNotificationProvider = new ConsoleNotificationProvider();
  }
  return activeNotificationProvider;
}
