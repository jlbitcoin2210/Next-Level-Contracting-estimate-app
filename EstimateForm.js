
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function EstimateForm() {
  const [formData, setFormData] = useState({
    projectName: "",
    roofType: "flat",
    roofSize: "",
    pitch: "",
    scope: {
      tearOff: false,
      isoInstall: false,
      torchOn: false,
    },
    notes: "",
  });

  const rateSheet = {
    tearOff: 175,
    isoInstall: 70,
    torchOn: 140 + 175,
  };

  const calculateTotal = () => {
    const { roofSize, scope } = formData;
    const squares = parseFloat(roofSize);
    let subtotal = 0;

    if (scope.tearOff) subtotal += squares * rateSheet.tearOff;
    if (scope.isoInstall) subtotal += squares * rateSheet.isoInstall;
    if (scope.torchOn) subtotal += squares * rateSheet.torchOn;

    const hst = subtotal * 0.13;
    const total = subtotal + hst;
    return { subtotal, hst, total };
  };

  const handleSubmit = () => {
    const pricing = calculateTotal();
    const emailBody = `Project Name: ${formData.projectName}\nRoof Type: ${formData.roofType}\nRoof Size: ${formData.roofSize} squares\nPitch: ${formData.pitch}\n\nScope:\n${formData.scope.tearOff ? "- Tear Off\n" : ""}${formData.scope.isoInstall ? "- ISO Install\n" : ""}${formData.scope.torchOn ? "- Torch-On 2 Ply\n" : ""}\n\nSubtotal: $${pricing.subtotal.toFixed(2)}\nHST: $${pricing.hst.toFixed(2)}\nTotal: $${pricing.total.toFixed(2)}\n\nNotes:\n${formData.notes}`;

    window.location.href = `mailto:CrossCountryContracting@gmail.com?subject=Estimate Request for ${formData.projectName}&body=${encodeURIComponent(emailBody)}`;
  };

  const pricing = calculateTotal();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Estimate Calculator (Review Only)</h1>
      <Input
        placeholder="Project Name / Address"
        value={formData.projectName}
        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
      />
      <div className="space-x-4">
        <label>
          <input
            type="radio"
            value="flat"
            checked={formData.roofType === "flat"}
            onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
          /> Flat Roof
        </label>
        <label>
          <input
            type="radio"
            value="shingle"
            checked={formData.roofType === "shingle"}
            onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
          /> Shingle Roof
        </label>
      </div>
      <Input
        placeholder="Roof Size (squares)"
        type="number"
        value={formData.roofSize}
        onChange={(e) => setFormData({ ...formData, roofSize: e.target.value })}
      />
      {formData.roofType === "shingle" && (
        <Input
          placeholder="Pitch (e.g., 6/12)"
          value={formData.pitch}
          onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
        />
      )}
      <div>
        <label className="font-semibold">Scope of Work:</label>
        <div className="space-y-2">
          <label>
            <Checkbox
              checked={formData.scope.tearOff}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                scope: { ...formData.scope, tearOff: checked },
              })}
            /> Tear Off (Tar & Gravel)
          </label>
          <label>
            <Checkbox
              checked={formData.scope.isoInstall}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                scope: { ...formData.scope, isoInstall: checked },
              })}
            /> ISO Installation (1"-1.5")
          </label>
          <label>
            <Checkbox
              checked={formData.scope.torchOn}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                scope: { ...formData.scope, torchOn: checked },
              })}
            /> Torch-On 2 Ply (Base + Cap)
          </label>
        </div>
      </div>
      <Textarea
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />

      <div className="border-t pt-4 space-y-2">
        <h2 className="font-bold">Estimate Preview:</h2>
        <p>Subtotal: ${pricing.subtotal.toFixed(2)}</p>
        <p>HST (13%): ${pricing.hst.toFixed(2)}</p>
        <p className="font-bold">Total: ${pricing.total.toFixed(2)}</p>
        <p className="italic text-sm text-gray-600">* This is a review estimate only. Final quote will be issued by Next Level Contracting.</p>
      </div>

      <Button onClick={handleSubmit}>Submit for Review</Button>
    </div>
  );
}
