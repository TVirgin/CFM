// src/pages/Records/AddRecord.tsx
import Layout from '@/components/layout';
import * as React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Select component is no longer needed as 'status' is removed

import { Person } from '../records/records.types'; // Adjust path if needed
import { addRecord } from '../../services/recordService'; // Adjust path
import { useUserAuth } from '../../context/userAuthContext'; // Adjust path
import { useNavigate } from 'react-router-dom';

interface IAddRecordProps {}

// Form data type based on the new Person, excluding 'id'
// We'll use strings for number fields in the form state for easier input handling
// and parse them to numbers upon submission.
type NewPersonFormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  birth: string;
  death: string;
  block: string;
  lot: string;  
  pos: string;  
  plot: string; 
};

const initialFormState: NewPersonFormData = {
  firstName: '',
  middleName: '',
  lastName: '',
  birth: '',
  death: '',
  block: '',
  lot: '',
  pos: '',
  plot: '',
};

const AddRecord: React.FunctionComponent<IAddRecordProps> = (props) => {
  const [formData, setFormData] = React.useState<NewPersonFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const { user } = useUserAuth(); // Get the current user
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!user) {
      setError("You must be logged in to add a record.");
      return;
    }

    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }
    // Add more specific validation as needed for other fields

    setIsSubmitting(true);

    try {
      // Prepare data for the service.
      // The addRecord service function expects data that can form a Person object (excluding id).
      // Your service function might also add a 'createdAt' timestamp or a 'userId'.
      // Ensure the object passed matches what `addRecord` needs.
      const recordDataForService: Omit<Person, 'id'> = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim(),
        lastName: formData.lastName.trim(),
        birth: formData.birth, //? new Date(formData.birth + 'T00:00:00').toDateString() : "", 
        death: formData.death, //? new Date(formData.death + 'T00:00:00').toDateString() : "",
        block: formData.block.trim(),
        lot: Number(formData.lot) || 0,  
        pos: Number(formData.pos) || 0,  
        plot: Number(formData.plot) || 0,
        // If your Firestore documents or 'addRecord' service needs a userId, add it here:
        // userId: user.uid,
        // And ensure 'userId' is part of your 'Person' type in records.types.ts
      };

      console.log("record to add");
      console.log(formData.death);

      const newRecordId = await addRecord(recordDataForService);
      setSuccessMessage(`Record added successfully!`);
      setFormData(initialFormState); // Reset form

      setTimeout(() => {
        // navigate('/recordsList'); // Navigate to records list or a relevant page
      }, 1500);

    } catch (err: any) {
      console.error("Failed to add record:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

 const handleCancel = () => {
    // Reset the form to its initial, empty state
    setFormData(initialFormState);
    
    // Clear any feedback messages that might be displayed
    setError(null);
    setSuccessMessage(null); 
  };

  return (
    <Layout>
      <div className="fflex flex-col items-center justify-start w-full py-8 md:py-12">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Add New Cemetery Record</CardTitle>
            <CardDescription>Fill in the details for the new record.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-start gap-6">
                {/* lot 1: Names */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} disabled={isSubmitting} required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" placeholder="Enter middle name (optional)" value={formData.middleName} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} disabled={isSubmitting} required />
                </div>


                {/* Birth & Death (Assuming years or timestamps handled as numbers) */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="birth">Birth Date</Label>
                    <Input id="birth" type="text" placeholder="e.g., 1990 or 1990-05-14" value={formData.birth} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="death">Death Date</Label>
                    <Input id="death" type="text" placeholder="e.g., 2023 or 2023-10-26" value={formData.death} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                </div>

                {/* Plot Location */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="block">Block</Label>
                    <Input id="block" placeholder="e.g., A" value={formData.block} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="lot">lot</Label>
                    <Input id="lot" type="number" placeholder="e.g., 12" value={formData.lot} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="pos">Position</Label>
                    <Input id="pos" type="number" placeholder="e.g., 3" value={formData.pos} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="plot">Plot</Label>
                    <Input id="plot" type="number" placeholder="e.g., 3" value={formData.plot} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                </div>

                {error && <p className="text-sm text-red-600 pt-2">{error}</p>}
                {successMessage && <p className="text-sm text-green-600 pt-2">{successMessage}</p>}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
            {/* This button will trigger the form's onSubmit when clicked */}
            <Button type="submit" onClick={(e) => handleSubmit(e as any)} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Record'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default AddRecord;