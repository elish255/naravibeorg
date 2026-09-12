export const PAYMENT_AMOUNT = 15000;
export const PAYMENT_CURRENCY = "TZS";

export async function registerUser() { throw new Error("Usajili wa database umezimwa. Tumia fomu ya usajili kisha lipia."); }
export async function loginWithUsername() { throw new Error("Login ya database imezimwa."); }
export async function submitManualPayment() { return { success: true }; }
export async function getAdminPaymentRequests() { return { requests: [] }; }
export async function approveManualPayment() { return { success: false }; }
export async function rejectManualPayment() { return { success: false }; }
