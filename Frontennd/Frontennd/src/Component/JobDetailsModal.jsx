import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, MapPin, DollarSign, Calendar, Briefcase, CheckCircle } from 'lucide-react'
import api from '../utils/api'

export default function JobDetailsModal({ isOpen, onClose, jobId, onApply }) {
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen && jobId) {
            fetchJobDetails()
        } else {
            setJob(null);
        }
    }, [isOpen, jobId])

    const fetchJobDetails = async () => {
        setLoading(true)
        try {
            const res = await api.get(`/jobs/${jobId}`)
            setJob(res.data.job)
        } catch (error) {
            console.error("Error fetching job details:", error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        })
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                                    </div>
                                ) : job ? (
                                    <>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 leading-6">
                                                    {job.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full capitalize">
                                                        {job.jobType}
                                                    </span>
                                                    <span className="text-gray-500 text-sm">
                                                        Posted {formatDate(job.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={onClose}
                                                className="text-gray-400 hover:text-gray-500 transition-colors"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="mr-2 text-gray-400 h-5 w-5" />
                                                {job.location || "Remote"}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="mr-2 text-gray-400 h-5 w-5" />
                                                {job.salaryFrom && job.salaryTo
                                                    ? `$${job.salaryFrom.toLocaleString()} - $${job.salaryTo.toLocaleString()}`
                                                    : "Salary not disclosed"}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Briefcase className="mr-2 text-gray-400 h-5 w-5" />
                                                {job.createdBy?.email ? "Recruiter Verified" : "Company Confidential"}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                                {job.description}
                                            </p>
                                        </div>

                                        <div className="mb-8">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills Required</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {job.skills?.length > 0 ? job.skills.map((skill, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                                        {skill}
                                                    </span>
                                                )) : (
                                                    <span className="text-gray-500 italic">No specific skills listed</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                            <button
                                                onClick={onClose}
                                                className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                                            >
                                                Close
                                            </button>
                                            <button
                                                onClick={() => { onApply(job._id); onClose(); }}
                                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-200"
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>Job details not found.</p>
                                        <button onClick={onClose} className="mt-4 text-indigo-600">Close</button>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
