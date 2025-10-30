export default interface ILoginPage {
  login(username: string, password: string): Promise<void>;
}
