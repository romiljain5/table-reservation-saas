import TablesList from "@/components/dashboard/TablesList";
import AddTableModal from "@/components/dashboard/AddTableModal";
import TableLayout from "@/components/tables/TableLayout";

export default function TablesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tables</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage all tables for the selected restaurant.
          </p>
        </div>

        <AddTableModal />
      </div>

      <TablesList />
      <TableLayout/>
    </div>
  );
}
