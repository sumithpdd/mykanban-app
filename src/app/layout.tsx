import type { Metadata } from 'next'
import { Providers } from "@/redux/provider";
import { AuthProvider } from "./components/AuthProvider";
import Navbar from './components/Navbar';
import { Plus_Jakarta_Sans } from "next/font/google";
import './globals.css'

const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: 'My Kanban Task Management App',
  description: 'A full-stack Kanban task management application with advanced features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
return (
 <html lang="en" className={pjs.className}>
   <body className='pb-24 h-screen overflow-hidden'>
     <AuthProvider>
       <Providers>
         <Navbar />  {/* Render the component here */}
         {children}
       </Providers>
     </AuthProvider>
   </body>
 </html>
 )}