"use client";
import { JobsPost, JobsPostList } from "@/app/utils/utils";
import React, { useEffect, useState } from "react";
import JobListSideBar from "./job-list-sidebar";
import JobContent from "./job-content";
import { useJobId } from "@/app/hooks/useJobId";

const JobSearchPage = () => {
  const jobId = useJobId();
  const jobs: JobsPost[] = JobsPostList;
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  return (
    <div className="flex flex-1 overflow-hidden justify-center z-10">
      <aside className=" bg-white w-[450px]">
        {!isLoading ? (
          <div className="p-4 border border-t-0">
            <h2 className="text-xl font-bold">intern in Vietnam</h2>
            <p className="text-gray-600">{jobs.length} results</p>
          </div>
        ) : (
          <div className="p-4 border  border-t-0">
            <div className="w-[300px] h-4 bg-gray-400 rounded-full mb-2" />
            <div className="w-[200px] h-4 bg-gray-400 rounded-full" />
          </div>
        )}
        <div className="h-[77vh] overflow-y-auto border border-t-0">
          <div className="border-b ">
            {jobs.map((job, index) => (
              <JobListSideBar
                key={index}
                data={job}
                isSelection={index === Number(jobId) - 1 ? true : false}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      </aside>
      <div className="flex-1 bg-white max-w-[700px] p-10 h-[85vh] overflow-y-auto border border-l-0 border-t-0">
        <JobContent data={jobs[Number(jobId) - 1]} />
      </div>
    </div>
  );
};

export default JobSearchPage;
