https://github.com/JaleelB/shadcn-tag-input/assets/78449846/7f678789-ef5e-4913-b26c-9317003d6dbc

[Shadcn Tag Input](https://shadcn-tag-input.vercel.app/) is a tag input component implementation of Shadcn's input component. It's customizable, but styled by default (Shadcn's default styling).

## Features

- Customizable: Easily style your tags with various options.
- Autocomplete: Enable autocomplete with a list of suggestions.
- Validation: Validate tags based on custom logic.
- Tag Count: Display the number of tags.
- Delimiter Support: Use custom delimiters to separate tags.
- Accessibility: Built with accessibility in mind.

## Why

To be honest, I needed a tagging component for a project. I looked around for any tagging components that used Shadcn's design system, but I couldn't find any. So, I decided to make one myself. I hope you find it useful!

## Setup

Run the shadcn-ui init command to setup your project:

```bash
npx shadcn-ui@latest init
```

Run the shadcn-ui add commands to add the necessary components to your project:

```bash
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
npx shadcn-ui@latest add command
npx shadcn-ui@latest add toast
```

Copy and paste the folowing code into a new file:

```jsx
import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';                                                    
import { cva, type VariantProps } from 'class-variance-authority';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import { toast } from './ui/use-toast';
import { v4 as uuid } from 'uuid';
  

const tagVariants = cva(
  'transition-all border inline-flex items-center text-sm pl-2 rounded-md',
  {
    variants: {
        variant: {
            default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            primary: 'bg-primary border-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive border-destructive text-destructive-foreground hover:bg-destructive/90',
        },
        size: {
            sm: 'text-xs h-7',
            md: 'text-sm h-8',
            lg: 'text-base h-9',
            xl: 'text-lg h-10',
        },
        shape: {
            default: 'rounded-sm',
            rounded: 'rounded-full',
            square: 'rounded-none',
            pill: 'rounded-lg',
        },
        borderStyle: {
            default: 'border-solid',
            none: 'border-none',
        },
        textCase: {
            uppercase: 'uppercase',
            lowercase: 'lowercase',
            capitalize: 'capitalize',
        },
        interaction: {
            clickable: 'cursor-pointer hover:shadow-md',
            nonClickable: 'cursor-default',
        },
        animation: {
            none: '',
            fadeIn: 'animate-fadeIn',
            slideIn: 'animate-slideIn',
            bounce: 'animate-bounce',
        },
        textStyle: {
            normal: 'font-normal',
            bold: 'font-bold',
            italic: 'italic',
            underline: 'underline',
            lineThrough: 'line-through',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
        shape: 'default',
        borderStyle: 'default',
        textCase: 'capitalize',
        interaction: 'nonClickable',
        animation: 'fadeIn',
        textStyle: 'normal',
    },
  }
);

export enum Delimiter {
    Comma = ',',
    Enter = 'Enter',
    Space = ' '
}

type OmittedInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export type Tag = {
    id: string;
    text: string;
}

export interface TagInputProps extends OmittedInputProps, VariantProps<typeof tagVariants> {
    placeholder?: string;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;  
    enableAutocomplete?: boolean;
    autocompleteOptions?: Tag[];
    maxTags?: number;
    minTags?: number;
    readOnly?: boolean;
    disabled?: boolean;
    onTagAdd?: (tag: string) => void;
    onTagRemove?: (tag: string) => void;
    allowDuplicates?: boolean;
    validateTag?: (tag: string) => boolean;
    delimiter?: Delimiter;
    showCount?: boolean;
    placeholderWhenFull?: string;
    sortTags?: boolean;
    delimiterList?: string[];
    truncate?: number;
    minLength?: number;
    maxLength?: number;
    value?: string | number | readonly string[] | { id: string; text: string }[];
    autocompleteFilter?: (option: string) => boolean;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>((props, ref) => {

    const { 
        placeholder, 
        tags, 
        setTags, 
        variant, 
        size, 
        shape,
        className, 
        enableAutocomplete, 
        autocompleteOptions,
        maxTags,
        delimiter = Delimiter.Comma,
        onTagAdd,
        onTagRemove,
        allowDuplicates,
        showCount,
        validateTag,
        placeholderWhenFull = 'Max tags reached',
        sortTags,
        delimiterList,
        truncate,
        autocompleteFilter,
        borderStyle,
        textCase,
        interaction, 
        animation, 
        textStyle,
        minLength,
        maxLength,
    } = props;

    const [inputValue, setInputValue] = React.useState('');
    const [tagCount, setTagCount] =  React.useState(Math.max(0, tags.length));
    const inputRef = React.useRef<HTMLInputElement>(null);

    if ((maxTags !== undefined && maxTags < 0) || (props.minTags !== undefined && props.minTags < 0)) {
        console.warn("maxTags and minTags cannot be less than 0");
        toast({
            title: "maxTags and minTags cannot be less than 0",
            description: "Please set maxTags and minTags to a value greater than or equal to 0",
            variant:"destructive"
        })
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (delimiterList ? delimiterList.includes(e.key) : e.key === delimiter || e.key === Delimiter.Enter) {
            e.preventDefault();
            const newTagText = inputValue.trim();
        
            if (validateTag && !validateTag(newTagText)) {
                return;
            }

            if (minLength && newTagText.length < minLength) {
                console.warn("Tag is too short");
                toast({
                    title: "Tag is too short",
                    description: "Please enter a tag with more characters",
                    variant:"destructive"
                })
                return;
            }
        
            // Validate maxLength
            if (maxLength && newTagText.length > maxLength) {
                toast({
                    title: "Tag is too long",
                    description: "Please enter a tag with less characters",
                    variant:"destructive"
                })
                console.warn("Tag is too long");
                return;
            }
        
            const newTagId = uuid(); 

            if (newTagText && (allowDuplicates || !tags.some(tag => tag.text === newTagText)) && (maxTags === undefined || tags.length < maxTags)) {
                setTags([...tags, { id: newTagId, text: newTagText }]); 
                onTagAdd?.(newTagText);
                setTagCount((prevTagCount) => prevTagCount + 1);
            }
            setInputValue('');
        }
    };
    
    const removeTag = (idToRemove: string) => {
        setTags(tags.filter((tag) => tag.id !== idToRemove));
        onTagRemove?.(tags.find(tag => tag.id === idToRemove)?.text || '');
        setTagCount((prevTagCount) => prevTagCount - 1);
    };

    const filteredAutocompleteOptions = autocompleteFilter
        ? autocompleteOptions?.filter(option => autocompleteFilter(option.text))
        : autocompleteOptions;

    const displayedTags = sortTags ? [...tags].sort() : tags;

    const truncatedTags = truncate
    ? tags.map((tag) => ({
        id: tag.id,
        text: tag.text?.length > truncate ? `${tag.text.substring(0, truncate)}...` : tag.text
      }))
    : displayedTags;

    return (
        <div>
            <div className={`flex flex-wrap gap-2 rounded-md ${tags.length !== 0 && 'mb-3'}`}>
                {truncatedTags.map((tagObj) => (
                    <span 
                        key={tagObj.id} 
                        className={cn(tagVariants({ 
                            variant, size, shape, 
                            borderStyle, textCase,
                            interaction, animation, textStyle 
                        }))}
                    >
                        {tagObj.text}
                        <Button
                            type="button" 
                            variant="ghost"
                            onClick={() => removeTag(tagObj.id)}
                            className={cn("py-1 px-3 h-full hover:bg-transparent")}
                        >
                            <X size={14} />
                        </Button>
                    </span>
                ))}
            </div>
            {enableAutocomplete ? (
                <>
                    <Command className='border mt-2 sm:min-w-[450px]'>
                        <CommandInput 
                            placeholder={maxTags !== undefined && tags.length >= maxTags ? placeholderWhenFull : placeholder}  
                            disabled={maxTags !== undefined && tags.length >= maxTags}
                        />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                {filteredAutocompleteOptions?.map((optionObj) => (
                                    <CommandItem 
                                        key={uuid()}
                                        className={`${maxTags !== undefined && tags.length >= maxTags ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div
                                            className={`w-full ${maxTags !== undefined && tags.length >= maxTags ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                            onClick={() => {
                                                if (optionObj.text && (allowDuplicates || !tags.some(tag => tag.text === optionObj.text)) && (maxTags === undefined || tags.length < maxTags)) {
                                                    setTags([...tags, optionObj]);
                                                    onTagAdd?.(optionObj.text);
                                                    setTagCount((prevTagCount) => prevTagCount + 1);
                                                }
                                            }}
                                        >
                                            {optionObj.text}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    {maxTags && 
                        <div className='flex'>
                            <span className='text-muted-foreground text-sm mt-1 ml-auto'>{`${tagCount}`}/{`${maxTags}`}</span>
                        </div>
                    }
                </>
            ): (
                <>
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder={maxTags !== undefined && tags.length >= maxTags ? placeholderWhenFull : placeholder}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={className}
                        autoComplete={enableAutocomplete ? 'on' : 'off'}
                        list={enableAutocomplete ? 'autocomplete-options' : undefined}
                        disabled={maxTags !== undefined && tags.length >= maxTags}
                    />
                    {showCount && maxTags && <div className='flex'>
                       <span className='text-muted-foreground text-sm mt-1 ml-auto'>{`${tagCount}`}/{`${maxTags}`}</span>
                    </div>}
                </>
            )}
        </div>
    );
});

TagInput.displayName = 'TagInput';

export { TagInput };
```

## Usage

Here's a sample implementation that initializes the component with a list of initial tags and suggestions list. Apart from this, there are multiple events, handlers for which need to be set.

```jsx
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Tag, TagInput } from '@/components/tag-input'
import Link from 'next/link'
import { Button, buttonVariants } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  topics: z.array(z.object({
      id: z.string(),
      text: z.string()
  })),
});
  
export default function Hero(){

  const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema)
  })

  const [tags, setTags] = React.useState<Tag[]>([]);

  const { setValue } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
  }

  return (
    <section className="z-10 max-w-5xl w-full flex flex-col items-center text-center gap-5">
        <div className="z-10 w-full flex flex-col items-center text-center gap-5">
            <h1 className='scroll-m-20 text-4xl font-bold tracking-tight'>Shadcn Tag Input</h1>
            <p className='text-muted-foreground max-w-[450px]'>An implementation of a Tag Input component built on top of Shadcn UI&apos;s input component.</p>
            <div className='flex gap-2 mt-1'>
                <Link 
                    href="#try"
                    className={`${buttonVariants({ variant: "default", size: "lg" })} min-w-[150px] shadow-sm`}
                >
                    Try it out
                </Link>
                <Link 
                    href="https://github.com/JaleelB/shadcn-tag-input"
                    className={`${buttonVariants({ variant: "secondary", size: "lg" })} shadow-sm`}
                >
                    Github
                </Link>
            </div>
        </div>

        <div id="try" className="w-full py-8">
            <div className='w-full relative my-4 flex flex-col space-y-2'>
            <div className='preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-start">
                        <FormField
                            control={form.control}
                            name="topics"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel className="text-left">Topics</FormLabel>
                                    <FormControl>
                                        <TagInput
                                            {...field}
                                            placeholder="Enter a topic"
                                            tags={tags}
                                            className='sm:min-w-[450px]'
                                            setTags={(newTags) => {
                                                setTags(newTags);
                                                setValue("topics", newTags as [Tag, ...Tag[]]);
                                            }} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        These are the topics that you&apos;re interested in.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
            </div>
        </div>
    </section>
  );
}
```

## Tag Variants

This section describes the various variants you can use with the `TagInput` component. Each variant has a unique set of properties that allow you to customize the appearance and behavior of the tags.

### Variant

#### Default
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Primary
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="bg-primary border-primary text-primary-foreground hover:bg-primary/90"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Destructive
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="bg-destructive border-destructive text-destructive-foreground hover:bg-destructive/90"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Size

#### Small (sm)
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="text-xs h-7"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Medium (md)
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="text-sm h-8"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Large (lg)
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="text-base h-9"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Extra Large (xl)
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="text-lg h-10"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Shape

#### Default
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="rounded-sm"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Rounded
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="rounded-full"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Square
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="rounded-none"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Pill
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="rounded-lg"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Border Style

#### Default
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="border-solid"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### None
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="border-none"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Text Case

#### Uppercase
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="uppercase"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Lowercase
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="lowercase"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Capitalize
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="capitalize"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Interaction

#### Clickable
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="cursor-pointer hover:shadow-md"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Non-Clickable
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="cursor-default"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Animation

#### None
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className=""
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Fade In
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="animate-fadeIn"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Slide In
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="animate-slideIn"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Bounce
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="animate-bounce"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Text Style

#### Normal
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="font-normal"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Bold
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="font-bold"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Italic
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="italic"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Underline
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="underline"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Line Through
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="line-through"
  setTags={(newTags) => setTags(newTags)}
/>
```


## Props
| Option               | Type                                      | Default | Description                                                    |
|----------------------|-------------------------------------------|---------|----------------------------------------------------------------|
| placeholder          | string                                    | `""`    | Placeholder text for the input.                                 |
| tags                 | Array<{ id: string, text: string }>                                     | `[]`    | An array of tags that are displayed as pre-selected.           |
| setTags              | React.Dispatch<React.SetStateAction<{ id: string, text: string }[]>> | `null`  | Function to set the state of tags.                              |
| enableAutocomplete    | boolean                                   | `false` | Enable autocomplete feature. Must be used with autocompleteOptions. |
| autocompleteOptions   | Array<{ id: string, text: string }>                                     | `[]`    | List of options for autocomplete. Must be used with enableAutocomplete. |
| maxTags              | number                                    | `null`  | Maximum number of tags allowed.                                 |
| minTags              | number                                    | `null`  | Minimum number of tags required.                                |
| readOnly             | boolean                                   | `false` | Make the input read-only.                                       |
| disabled             | boolean                                   | `false` | Disable the input.                                             |
| onTagAdd             | Function                                  | `null`  | Callback function when a tag is added.                          |
| onTagRemove          | Function                                  | `null`  | Callback function when a tag is removed.                        |
| allowDuplicates      | boolean                                   | `false` | Allow duplicate tags.                                           |
| maxLength            | number                                    | `null`  | Maximum length of a tag.                                        |
| minLength            | number                                    | `null`  | Maximum length of a tag.                                        |
| validateTag          | Function                                  | `null`  | Function to validate a tag.                                     |
| delimiter            | Delimiter                                 | `null`  | Character used to separate tags.                                |
| showCount            | boolean                                   | `false` | Show the count of tags.                                         |
| placeholderWhenFull  | string                                    | `""`    | Placeholder text when tag limit is reached.                     |
| sortTags            | boolean                                   | `false` | Sort tags alphabetically.                                       |
| delimiterList        | Array                                     | `[]`    | List of characters that can be used as delimiters.              |
| truncate             | number                                    | `null`  | Truncate tag text to a certain length.                           |
| autocompleteFilter   | Function                                  | `null`  | Function to filter autocomplete options.                         |


