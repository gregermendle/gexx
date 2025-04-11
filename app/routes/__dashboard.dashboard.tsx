import { ChartAreaInteractive } from "~/components/chart-area-interactive";
import InventoryTable from "~/components/inventory-table";
import { SectionCards } from "~/components/section-cards";
import { SiteHeader } from "~/components/site-header";

export default function Dashboard() {
  return (
    <>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <div className="px-4 lg:px-6">
              <InventoryTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
