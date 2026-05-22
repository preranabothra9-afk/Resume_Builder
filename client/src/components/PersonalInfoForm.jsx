import { BriefcaseBusiness, Linkedin, MapPin, Phone, User, Globe, Mail, ImagePlus } from "lucide-react";
import React from "react";

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground, savingStatus, setIsEditing }) => {

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const fields = [
    { key: "full_name", label: "Full Name", icon: User, type: "text", required: true },
    { key: "email", label: "Email Address", icon: Mail, type: "email", required: true },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    { key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, type: "url" },
    { key: "website", label: "Personal Website", icon: Globe, type: "url" }
  ];

  return (
    <div>
      <div className="flex items-center gap-5">
        <label className="cursor-pointer group">
          {data.image ? (
            <img src={typeof data.image === "string" ? data.image : URL.createObjectURL(data.image)}
              alt="user"
              className="size-16 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-violet-500/50 transition-all" />
          ) : (
            <div className="size-16 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/30 group-hover:border-violet-500/40 group-hover:text-violet-400 transition-all">
              <ImagePlus className="size-6" />
            </div>
          )}
          <input type="file" accept="image/jpeg, image/png" className="hidden"
            onChange={(e) => handleChange("image", e.target.files[0])} />
        </label>

        <div>
          <p className="text-sm font-medium text-white/70">Profile Photo</p>
          <p className="text-xs text-white/30">Upload your photo</p>
          {data.image && (
            <label className="inline-flex items-center gap-2 mt-1.5 cursor-pointer">
              <input type="checkbox" className="sr-only peer"
                onChange={() => { setRemoveBackground((prev) => !prev); setIsEditing(true); }}
                checked={removeBackground} disabled={savingStatus === "saving"} />
              <div className="w-8 h-4 bg-white/10 rounded-full peer-checked:bg-violet-600 transition-colors relative">
                <span className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-xs text-white/40">Remove bg</span>
            </label>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key}>
              <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-1.5">
                <Icon className="size-3.5 text-white/30" />
                {field.label}
                {field.required && <span className="text-rose-400">*</span>}
              </label>
              <input type={field.type} value={data[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}`} required={field.required} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
