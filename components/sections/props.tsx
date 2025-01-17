import React from "react";
import { Tag, TagInput } from "../tag-input";
import { Label } from "../ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { propOption, tagInputProps } from "@/utils/utils";
import { cn } from "@/lib/utils";
import { v4 as uuid } from 'uuid';
  

export default function Props(){
    
    const tags: Tag[] = [
        {id: uuid(), text: "Sports"}, 
        {id: uuid(), text: "Programming"},
        {id: uuid(), text: "Travel"},
    ];
    const [autocompleteTags, setAutocompleteTags] = React.useState<Tag[]>([]);
    const [maxTags, setMaxTags] = React.useState<Tag[]>([]);
    const [truncateTags, setTruncateTags] = React.useState<Tag[]>(tags);
    const [allowDuplicatesTags, setAllowDuplicatesTags] = React.useState<Tag[]>([]);

    const autoCompleteOptions = [
       ...tags,
        {id: uuid(), text: "Food"},
        {id: uuid(), text: "Movies"},
        {id: uuid(), text: "Art"},
        {id: uuid(), text: "Books"},
    ]

    return (
        <section id="props" className="max-w-5xl w-full py-8">
            <h2 className='font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0'>Props</h2>
           <div className="w-full">
                <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>Autocomplete</h3>
                <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
                    Enable or disable the autocomplete feature for the tag input.
                </p>
                <div className='preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border'>
                    <div className="space-y-2">
                        <Label htmlFor="">Topics</Label>
                        <TagInput
                            placeholder="Enter a topic"
                            tags={autocompleteTags}
                            enableAutocomplete
                            autocompleteOptions={autoCompleteOptions}
                            className='sm:min-w-[450px]'
                            setTags={(newTags) => {
                                setAutocompleteTags(newTags);
                            }} 
                        />
                    </div>
                </div>
           </div>
           <div className="w-full">
                <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>Max tags</h3>
                <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
                    Set the maximum number of tags that can be added.
                </p>
                <div className='preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border'>
                    <div className="space-y-2">
                        <Label htmlFor="">Topics</Label>
                        <TagInput
                            placeholder="Enter a topic"
                            tags={maxTags}
                            maxTags={5}
                            showCount
                            className='sm:min-w-[450px]'
                            setTags={(newTags) => {
                                setMaxTags(newTags);
                            }} 
                        />
                    </div>
                </div>
           </div>
           <div className="w-full">
                <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>Truncate</h3>
                <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
                    Prevent tags from overflowing the tag input by specifying the maximum number of characters to display.
                </p>
                <div className='preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border'>
                    <div className="space-y-2">
                        <Label htmlFor="">Topics</Label>
                        <TagInput
                            placeholder="Enter a topic"
                            tags={truncateTags}
                            truncate={4}
                            className='sm:min-w-[450px]'
                            setTags={(newTags) => {
                                setTruncateTags(newTags);
                            }} 
                        />
                    </div>
                </div>
           </div>
           <div className="w-full">
                <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>Allow dupplicate tags</h3>
                <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
                    Allow duplicate tags to be added to the tag input.
                </p>
                <div className='preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border'>
                    <div className="space-y-2">
                        <Label htmlFor="">Topics</Label>
                        <TagInput
                            placeholder="Enter a topic"
                            tags={allowDuplicatesTags}
                            allowDuplicates
                            className='sm:min-w-[450px]'
                            setTags={(newTags) => {
                                setAllowDuplicatesTags(newTags);
                            }} 
                        />
                    </div>
                </div>
           </div>
           <div className="w-full">
                <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>Options</h3>
                <div className="border rounded-md mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Option</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Default</TableHead>
                                <TableHead className={cn("w-[400px]")}>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                tagInputProps.map((prop: propOption, index) => (
                                    <TableRow 
                                        key={index * Math.random()}
                                        className={`${index%2 == 0 ? 'bg-muted/50': ''}`}
                                    >
                                        <TableCell>{prop.option}</TableCell>
                                        <TableCell>{prop.type}</TableCell>
                                        <TableCell >{prop.default}</TableCell>
                                        <TableCell>{prop.description}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
           </div>
        </section>
    )
}