import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const demo = [
    { id:'1', name:'Rajan Mehta', email:'rajan@techrise.in', phone:'+91 98765 43210', source:'Meta Ads', platform:'meta', stage:'hot', value:240000, tags:['Agency','₹20K/mo'], last_contact: new Date().toISOString() },
    { id:'2', name:'Sunita Agarwal', email:'sunita@glamoursalon.com', phone:'+91 87654 32109', source:'Google Ads', platform:'google', stage:'warm', value:180000, tags:['Salon Chain'], last_contact: new Date(Date.now()-86400000).toISOString() },
    { id:'3', name:'Arvind Kapoor', email:'arvind@buildprop.in', phone:'+91 76543 21098', source:'LinkedIn', platform:'linkedin', stage:'hot', value:360000, tags:['Real Estate'], last_contact: new Date(Date.now()-3600000).toISOString() },
    { id:'4', name:'Meena Nair', email:'meena@healthclinic.in', phone:'+91 65432 10987', source:'Meta Ads', platform:'meta', stage:'converted', value:240000, tags:['Healthcare','Paying ✓'], last_contact: new Date(Date.now()-172800000).toISOString() },
    { id:'5', name:'Suresh Pillai', email:'suresh@edupro.in', phone:'+91 54321 09876', source:'Google Ads', platform:'google', stage:'warm', value:180000, tags:['EdTech'], last_contact: new Date(Date.now()-43200000).toISOString() },
    { id:'6', name:'Kavitha Reddy', email:'kavitha@fashionhub.in', phone:'+91 43210 98765', source:'Instagram', platform:'instagram', stage:'cold', value:120000, tags:['Fashion','D2C'], last_contact: null },
    { id:'7', name:'Amit Shah', email:'amit@foodnow.in', phone:'+91 32109 87654', source:'Meta Ads', platform:'meta', stage:'hot', value:180000, tags:['F&B Chain'], last_contact: new Date(Date.now()-7200000).toISOString() },
  ]
  return NextResponse.json({ success: true, data: demo })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({ success: true, data: { id: Date.now().toString(), ...body, stage:'cold', created_at: new Date().toISOString() } })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({ success: true, data: body })
}
