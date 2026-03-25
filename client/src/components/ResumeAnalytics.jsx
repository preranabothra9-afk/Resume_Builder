import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const ResumeAnalytics = ({ analytics }) => {

  if (!analytics) return null;

  const countryData = Object.values(
    (analytics.viewHistory || []).reduce((acc, view) => {

      if (!acc[view.country]) {
        acc[view.country] = {
          country: view.country,
          views: 0
        };
      }

      acc[view.country].views += 1;

      return acc;

    }, {})
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-semibold mb-4">
        Resume Analytics
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="p-4 bg-blue-50 rounded">
          <p className="text-sm text-gray-500">Views</p>
          <p className="text-xl font-bold">{analytics.views || 0}</p>
        </div>

        <div className="p-4 bg-green-50 rounded">
          <p className="text-sm text-gray-500">Downloads</p>
          <p className="text-xl font-bold">{analytics.downloads || 0}</p>
        </div>

        <div className="p-4 bg-purple-50 rounded">
          <p className="text-sm text-gray-500">Countries</p>
          <p className="text-xl font-bold">
            {new Set((analytics.viewHistory || []).map(v => v.country)).size}
          </p>
        </div>

      </div>

      <h3 className="text-lg font-semibold mb-3">
        Views by Country
      </h3>

      <BarChart width={500} height={300} data={countryData}>
        <XAxis dataKey="country" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="views" fill="#3B82F6" />
      </BarChart>

    </div>
  );
};

export default ResumeAnalytics;