export type RootStackParamList = {
  appRoutes: undefined;
  Overview: undefined;
  Stock: undefined;
  Report: undefined;
  Promotions: undefined;
  Extract: undefined;
  SaleDetails: { sale: Sale };
  tickets: undefined;
  Home: undefined;
  AddBankSlip: undefined;
  TicketsDetails: { ticket: Ticket };
  forgetpassword: undefined;
  VerifyCode: undefined;
  emailConfirmation: { email: string };
  login: undefined;
  // Adicione outras rotas aqui se necessário
};
