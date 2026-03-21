import { Link } from "react-router-dom";
import { usePatientStats } from "@/hooks/usePatientStats";

export function Dashboard() {
	const { data: stats } = usePatientStats();

	return (
		<section className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
			<div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg p-6">
				<h1 className="text-2xl font-bold text-center text-gray-900">Patients Overview</h1>
				<p className="mt-2 text-center text-sm text-gray-600">Total includes active and inactive patients only.</p>

				<div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
					<div className="border border-gray-200 rounded-md p-3">
						<p className="text-xs text-gray-500">Total</p>
						<p className="text-2xl font-semibold text-gray-900">{stats?.total ?? 0}</p>
					</div>
					<div className="border border-gray-200 rounded-md p-3">
						<p className="text-xs text-gray-500">Active</p>
						<p className="text-2xl font-semibold text-gray-900">{stats?.active ?? 0}</p>
					</div>
					<div className="border border-gray-200 rounded-md p-3">
						<p className="text-xs text-gray-500">Inactive</p>
						<p className="text-2xl font-semibold text-gray-900">{stats?.inactive ?? 0}</p>
					</div>
				</div>

				<div className="mt-6 text-center">
					<Link to="/patients" className="text-blue-600 hover:text-blue-700 font-medium">
						Manage Patients
					</Link>
				</div>
			</div>
		</section>
	);
}
