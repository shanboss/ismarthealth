import Sidebar from "../components/Physician/Sidebar";
import PatientTable from "../components/Physician/PatientDetails";
import Dashboard from "../components/Physician/Dashboard";
import PrevSuperSpecialty from "../components/Physician/PrevSuperSpecialty";
import DoctorReferrals from "../components/Physician/DoctorReferrals";
import LabConsultQueue from "../components/Physician/LabConsultQueue";

type SearchParams = {
  tab?: string;
};

// Patient table moved to ./PatientTable

function Placeholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default async function PhysicianPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const tab = (sp?.tab ?? "dashboard").toLowerCase();

  let content: React.ReactNode;
  switch (tab) {
    case "patients":
      content = <PatientTable />;
      break;
    case "prevsuperspeciality":
      content = <PrevSuperSpecialty />;
      break;
    case "other-doctor-referrals":
      content = <DoctorReferrals />;
      break;
    case "appointments":
      content = (
        <Placeholder
          title="Appointments"
          description="Manage and view upcoming appointments."
        />
      );
      break;
    case "reports":
      content = (
        <Placeholder
          title="Reports"
          description="Analytics and medical reports will appear here."
        />
      );
      break;
    case "settings":
      content = <LabConsultQueue />;
      break;
    case "dashboard":
    default:
      content = <Dashboard />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 space-y-4 p-4 md:p-6">{content}</main>
    </div>
  );
}
