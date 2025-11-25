export function allowedActions(status: string) {
  switch (status) {
    case "PENDING":
      return ["CONFIRM", "CANCEL"];
    case "CONFIRMED":
      return ["SEAT", "CANCEL"];
    case "SEATED":
      return ["COMPLETED", "NO_SHOW"];
    default:
      return []; // Cancelled, Completed, No-Show
  }
}
