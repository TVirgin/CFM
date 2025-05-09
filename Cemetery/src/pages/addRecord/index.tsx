import Layout from '@/components/layout';
import * as React from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface IAddRecordProps {
}

const AddRecord: React.FunctionComponent<IAddRecordProps> = (props) => {
  return (
    <Layout >
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Add New Record</CardTitle>
          {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">First Name</Label>
                <Input id="name" placeholder="First Name" />
                <Label htmlFor="name">Last Name</Label>
                <Input id="name" placeholder="First Name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">DOB</Label>
                <Input id="name" placeholder="Last Name" />
                <Label htmlFor="framework">DOD</Label>
                <Input id="name" placeholder="Last Name" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Add</Button>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default AddRecord;