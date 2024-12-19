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
  VerifyCode: { email: string };
  emailConfirmation: { email: string };
  login: undefined;
  createUser: undefined;
  AddProductToStock: undefined;
  UpdatePassword: { email: string };
  DetailsProductStock: { name; price; quantity; imgUrl; barcode };
  OurPlans: undefined;
  // Adicione outras rotas aqui se necessário
};
