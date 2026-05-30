"use client";

import { useState, useRef } from 'react';

const INPUT_CLS = "w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all dark:text-white text-sm";
const LABEL_CLS = "text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase ml-1 block mb-1";
const ERROR_CLS = "text-red-500 text-xs mt-1 ml-1";

type FormData = {
  fullName: string; dateOfBirth: string; gender: string; idNumber: string;
  address: string; phone: string; email: string;
  guardianName: string; guardianPhone: string; guardianOccupation: string;
  previousSchool: string; lastGrade: string; currentResults: string;
  programTrack: string; specificCourse: string; intakeStatus: string;
  nationalIdImage: string; academicResultsImage: string; hearAboutUs: string;
};

export default function OnlineApplication() {
  const [formStep, setFormStep] = useState(1);
  const totalSteps = 4;
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [form, setForm] = useState<FormData>({
    fullName: '', dateOfBirth: '', gender: '', idNumber: '',
    address: '', phone: '', email: '',
    guardianName: '', guardianPhone: '', guardianOccupation: '',
    previousSchool: '', lastGrade: '', currentResults: '',
    programTrack: '', specificCourse: '', intakeStatus: '',
    nationalIdImage: '', academicResultsImage: '', hearAboutUs: '',
  });

  const [nationalIdPreview, setNationalIdPreview] = useState('');
  const [academicPreview, setAcademicPreview] = useState('');
  const nationalIdRef = useRef<HTMLInputElement>(null);
  const academicRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileChange = (field: 'nationalIdImage' | 'academicResultsImage', file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setForm(prev => ({ ...prev, [field]: base64 }));
      if (field === 'nationalIdImage') setNationalIdPreview(base64);
      else setAcademicPreview(base64);
      setErrors(prev => ({ ...prev, [field]: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!form.gender) newErrors.gender = 'Please select a gender';
      if (!form.idNumber.trim()) newErrors.idNumber = 'ID / Birth Cert number is required';
      if (!form.address.trim()) newErrors.address = 'Address is required';
      if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!form.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
    }
    if (step === 2) {
      if (!form.guardianName.trim()) newErrors.guardianName = 'Guardian name is required';
      if (!form.guardianPhone.trim()) newErrors.guardianPhone = 'Guardian phone is required';
    }
    if (step === 3) {
      if (!form.programTrack) newErrors.programTrack = 'Please select a program track';
      if (!form.specificCourse) newErrors.specificCourse = 'Please select a course';
      if (!form.intakeStatus) newErrors.intakeStatus = 'Please select an intake preference';
    }
    if (step === 4) {
      if (!form.nationalIdImage) newErrors.nationalIdImage = 'Please upload your National ID / Birth Certificate image';
      if (!form.academicResultsImage) newErrors.academicResultsImage = 'Please upload your academic results';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(formStep)) setFormStep(s => s + 1);
  };

  const handleBack = () => {
    if (formStep > 1) setFormStep(s => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId }),
      });
      if (res.ok) setSubmitted(true);
      else {
        const d = await res.json();
        alert(d.error || 'Submission failed. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center space-y-6 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Application Submitted!</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Your application has been received. Our admissions team will be in touch with you shortly.</p>
        <button onClick={() => { setSubmitted(false); setFormStep(1); setForm({ fullName: '', dateOfBirth: '', gender: '', idNumber: '', address: '', phone: '', email: '', guardianName: '', guardianPhone: '', guardianOccupation: '', previousSchool: '', lastGrade: '', currentResults: '', programTrack: '', specificCourse: '', intakeStatus: '', nationalIdImage: '', academicResultsImage: '', hearAboutUs: '' }); setNationalIdPreview(''); setAcademicPreview(''); }} className="bg-[var(--primary)] text-white font-bold px-8 py-3 rounded-xl hover:bg-[var(--primary-hover)] transition-colors">
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Online Application
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Begin your journey with LifeSkills Institute. Fill in all details below.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 sm:px-10 border-b border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Application Form</h2>
              <span className="text-sm font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full">
                Step {formStep} of {totalSteps}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-500 ease-out" style={{ width: `${(formStep / totalSteps) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs font-semibold text-slate-400">
              <span className={formStep >= 1 ? 'text-[var(--primary)]' : ''}>Student Info</span>
              <span className={formStep >= 2 ? 'text-[var(--primary)]' : ''}>Guardian & Academic</span>
              <span className={formStep >= 3 ? 'text-[var(--primary)]' : ''}>Program</span>
              <span className={formStep >= 4 ? 'text-[var(--primary)]' : ''}>Documents</span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {/* STEP 1 */}
            {formStep === 1 && (
              <div className="space-y-5 animate-fade-in-up">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Student Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={LABEL_CLS}>Full Name</label>
                    <input type="text" className={INPUT_CLS} value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="John Doe" />
                    {errors.fullName && <p className={ERROR_CLS}>{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Date of Birth</label>
                    <input type="date" className={INPUT_CLS} value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
                    {errors.dateOfBirth && <p className={ERROR_CLS}>{errors.dateOfBirth}</p>}
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Gender</label>
                    <select className={INPUT_CLS} value={form.gender} onChange={e => set('gender', e.target.value)}>
                      <option value="">Select Gender...</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                    {errors.gender && <p className={ERROR_CLS}>{errors.gender}</p>}
                  </div>
                  <div>
                    <label className={LABEL_CLS}>ID / Birth Cert Number</label>
                    <input type="text" className={INPUT_CLS} value={form.idNumber} onChange={e => set('idNumber', e.target.value)} placeholder="ID-123456" />
                    {errors.idNumber && <p className={ERROR_CLS}>{errors.idNumber}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL_CLS}>Physical Address</label>
                    <input type="text" className={INPUT_CLS} value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, City" />
                    {errors.address && <p className={ERROR_CLS}>{errors.address}</p>}
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Phone Number</label>
                    <input type="tel" className={INPUT_CLS} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+263 77 000 0000" />
                    {errors.phone && <p className={ERROR_CLS}>{errors.phone}</p>}
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Email Address</label>
                    <input type="email" className={INPUT_CLS} value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" />
                    {errors.email && <p className={ERROR_CLS}>{errors.email}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {formStep === 2 && (
              <div className="space-y-5 animate-fade-in-up">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Parent / Guardian Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={LABEL_CLS}>Guardian Full Name</label>
                    <input type="text" className={INPUT_CLS} value={form.guardianName} onChange={e => set('guardianName', e.target.value)} placeholder="Jane Doe" />
                    {errors.guardianName && <p className={ERROR_CLS}>{errors.guardianName}</p>}
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Guardian Phone</label>
                    <input type="tel" className={INPUT_CLS} value={form.guardianPhone} onChange={e => set('guardianPhone', e.target.value)} placeholder="+263 77 000 0000" />
                    {errors.guardianPhone && <p className={ERROR_CLS}>{errors.guardianPhone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL_CLS}>Guardian Occupation</label>
                    <input type="text" className={INPUT_CLS} value={form.guardianOccupation} onChange={e => set('guardianOccupation', e.target.value)} placeholder="e.g. Teacher" />
                  </div>
                </div>

                <h3 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-6">Academic Background</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className={LABEL_CLS}>Previous School Attended</label>
                    <input type="text" className={INPUT_CLS} value={form.previousSchool} onChange={e => set('previousSchool', e.target.value)} placeholder="e.g. Harare High School" />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Highest Grade Completed</label>
                    <select className={INPUT_CLS} value={form.lastGrade} onChange={e => set('lastGrade', e.target.value)}>
                      <option value="">Select...</option>
                      <option>Primary</option><option>O-Level</option><option>A-Level</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Results Summary</label>
                    <input type="text" className={INPUT_CLS} value={form.currentResults} onChange={e => set('currentResults', e.target.value)} placeholder="e.g. 5 passes incl. Maths" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {formStep === 3 && (
              <div className="space-y-5 animate-fade-in-up">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Program Selection</h3>
                <div>
                  <label className={LABEL_CLS}>Application Track</label>
                  <select className={INPUT_CLS} value={form.programTrack} onChange={e => set('programTrack', e.target.value)}>
                    <option value="">Choose a Program Tier...</option>
                    <option>VocTech High School</option>
                    <option>ReSchooling Academy</option>
                    <option>College Programs</option>
                  </select>
                  {errors.programTrack && <p className={ERROR_CLS}>{errors.programTrack}</p>}
                </div>
                <div>
                  <label className={LABEL_CLS}>Specific Course / Subject</label>
                  <select className={INPUT_CLS} value={form.specificCourse} onChange={e => set('specificCourse', e.target.value)}>
                    <option value="">Select course...</option>
                    <option>Software Engineering</option>
                    <option>Agriculture & Sustainability</option>
                    <option>Business & Commerce</option>
                    <option>Engineering & Construction</option>
                    <option>ICT & Digital Skills</option>
                    <option>Other</option>
                  </select>
                  {errors.specificCourse && <p className={ERROR_CLS}>{errors.specificCourse}</p>}
                </div>
                <div>
                  <label className={LABEL_CLS}>Preferred Intake</label>
                  <div className="flex gap-4">
                    {['First Term', 'Mid-Year Transfer'].map(opt => (
                      <label key={opt} className={`flex-1 border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors ${form.intakeStatus === opt ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
                        <input type="radio" name="intake" className="accent-[var(--primary)] w-4 h-4" checked={form.intakeStatus === opt} onChange={() => set('intakeStatus', opt)} />
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {errors.intakeStatus && <p className={ERROR_CLS}>{errors.intakeStatus}</p>}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {formStep === 4 && (
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Documents Upload</h3>

                {/* National ID Upload */}
                <div>
                  <label className={LABEL_CLS}>National ID / Birth Certificate</label>
                  <div
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors group ${nationalIdPreview ? 'border-[var(--primary)]' : 'border-slate-300 dark:border-slate-700 hover:border-[var(--primary)]'}`}
                    onClick={() => nationalIdRef.current?.click()}
                  >
                    {nationalIdPreview ? (
                      <div className="space-y-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={nationalIdPreview} alt="National ID" className="max-h-48 mx-auto rounded-xl object-contain shadow" />
                        <p className="text-xs font-bold text-green-600">✓ Image uploaded — click to change</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Click to upload ID / Birth Certificate</p>
                        <p className="text-xs text-slate-500">JPG, PNG, PDF up to 5MB</p>
                      </>
                    )}
                    <input ref={nationalIdRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={e => handleFileChange('nationalIdImage', e.target.files?.[0] ?? null)} />
                  </div>
                  {errors.nationalIdImage && <p className={ERROR_CLS}>{errors.nationalIdImage}</p>}
                </div>

                {/* Academic Results Upload */}
                <div>
                  <label className={LABEL_CLS}>Academic Results / Transcripts</label>
                  <div
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors group ${academicPreview ? 'border-[var(--primary)]' : 'border-slate-300 dark:border-slate-700 hover:border-[var(--primary)]'}`}
                    onClick={() => academicRef.current?.click()}
                  >
                    {academicPreview ? (
                      <div className="space-y-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={academicPreview} alt="Academic Results" className="max-h-48 mx-auto rounded-xl object-contain shadow" />
                        <p className="text-xs font-bold text-green-600">✓ Image uploaded — click to change</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Click to upload Academic Results</p>
                        <p className="text-xs text-slate-500">JPG, PNG, PDF up to 5MB</p>
                      </>
                    )}
                    <input ref={academicRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={e => handleFileChange('academicResultsImage', e.target.files?.[0] ?? null)} />
                  </div>
                  {errors.academicResultsImage && <p className={ERROR_CLS}>{errors.academicResultsImage}</p>}
                </div>

                {/* How did you hear */}
                <div>
                  <label className={LABEL_CLS}>How did you hear about us?</label>
                  <select className={INPUT_CLS} value={form.hearAboutUs} onChange={e => set('hearAboutUs', e.target.value)}>
                    <option value="">Please Select...</option>
                    <option>Social Media (Facebook/Instagram)</option>
                    <option>Word of Mouth / Referral</option>
                    <option>Search Engine</option>
                    <option>Flyer or Poster</option>
                  </select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={handleBack} className="font-bold text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white px-4 py-2 disabled:opacity-30" disabled={formStep === 1}>
                ← Back
              </button>
              {formStep < totalSteps ? (
                <button type="button" onClick={handleNext} className="bg-[var(--primary)] text-white font-bold py-3.5 px-8 rounded-xl hover:bg-[var(--primary-hover)] transition-all shadow-md shadow-[var(--primary)]/20">
                  Next Step →
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={isLoading} className="bg-green-600 text-white font-extrabold py-3.5 px-8 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 disabled:opacity-50">
                  {isLoading ? 'Submitting...' : 'Submit Application ✓'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
