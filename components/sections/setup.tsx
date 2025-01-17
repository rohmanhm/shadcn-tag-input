import useClipboard from "@/hooks/use-copy";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import React from "react";
import { tagInputCode } from "@/app/code-snippets";
import { Copy } from "lucide-react";


export default function Setup(){

    const { isCopied, copyToClipboard } = useClipboard();

    return (
        <section id="setup" className="max-w-5xl w-full py-8">
          <h2 className='font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0'>Setup</h2>
          <div className="w-full">
            <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>Install Shadcn via CLI</h3>
            <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
              Run the <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">shadcn-ui</code> init command to setup your project:
            </p>
            <div data-rehype-pretty-code-fragment="">
              <pre className="relative mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
              <Button 
                  className='absolute top-2 right-2 px-3 hover:bg-white/40'
                  variant='ghost'
                  onClick={async() =>{
                    await copyToClipboard('npx shadcn-ui@latest init');
                    if(isCopied){
                        toast({
                            title: 'Copied to clipboard',
                            description: 'The command has been copied to your clipboard.',
                            variant: 'default'
                        });
                    }
                }}
                >
                  <Copy className="text-white/70 h-4 w-4"/>
                </Button>
                <code className="relative rounded bg-transparent text-white py-[0.2rem] font-mono text-sm px-4">
                  npx shadcn-ui@latest init
                </code>
              </pre>
            </div> 
          </div>
          <div className="w-full">
            <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>
              Install necessary Shadcn components:
            </h3>
            <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
              Run the <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">shadcn-ui</code> add command to add the necessary shadcn components to your project:
            </p>
            <div data-rehype-pretty-code-fragment="">
              <pre className="relative mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 px-2 dark:bg-zinc-900">
              <Button 
                  className='absolute top-2 right-2 px-3 hover:bg-white/40 cursor-pointer'
                  variant='ghost'
                  onClick={async() =>{
                    await copyToClipboard('npx shadcn-ui@latest add input');
                    if(isCopied){
                      toast({
                          title: 'Copied to clipboard',
                          description: 'The command has been copied to your clipboard.',
                          variant: 'default'
                      });
                    }
                }}
                >
                  <Copy className="text-white/70 h-4 w-4"/>
                </Button>
                <code className="relative rounded bg-transparent text-white py-[0.2rem] font-mono text-sm px-4">
                  {`npx shadcn-ui@latest add input\n npx shadcn-ui@latest add button\n npx shadcn-ui@latest add command\n npx shadcn-ui@latest add toast`.split('\n').map((line: string, index:number) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </code>
              </pre>
            </div> 
          </div>
          <div className="w-full">
            <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>
              Create a new tag input component:
            </h3>
            <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
              Copy and paste the folowing code into a new file:
            </p>
            <div className="relative w-full">
              <Button 
                  className='absolute z-40 top-2 right-2 px-3 hover:bg-white/40'
                  variant='ghost'
                  onClick={async() =>{
                      await copyToClipboard(tagInputCode);
                      if(isCopied){
                          toast({
                              title: 'Copied to clipboard',
                              description: 'The command has been copied to your clipboard.',
                              variant: 'default'
                          });
                      }
                  }}
              >
                <Copy className="text-white/70 h-4 w-4"/>
              </Button>
              <pre className="relative mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 p-4 dark:bg-zinc-900">
                <code 
                  className="relative rounded bg-transparent text-white py-[0.2rem] max-h-[400px] overscroll-y-auto font-mono text-sm px-4"
                >
                  {tagInputCode.split('\n').map((line: string, index:number) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </code>
              </pre>
            </div> 
          </div>
        </section>
    )
}