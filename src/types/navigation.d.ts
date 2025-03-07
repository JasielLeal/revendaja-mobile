export type RootStackParamList = {
  appRoutes: { screen: string; params?: { screen: string } };
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
  PedingSale: undefined;
  PedingSaleDetails: { sale: Sale };
  AddCustomProduct: undefined;
  MyPlan: undefined;
  Notifications: undefined;
  // Adicione outras rotas aqui se necessário
};
