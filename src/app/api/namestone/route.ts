import { NextResponse } from 'next/server';
import NameStone from '@namestone/namestone-sdk';

// Initialize NameStone SDK
const NAMESTONE_API_KEY = process.env.NAMESTONE_API_KEY;
const NAMESTONE_API_CONFIG = { network: 'sepolia' as const };
const ns = new NameStone(NAMESTONE_API_KEY, NAMESTONE_API_CONFIG);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const name = searchParams.get('name');
  const address = searchParams.get('address');
  const exact_match = searchParams.get('exact_match') === 'true';

  if (address) {
    try {
      const results = await ns.getNames({ address });
      return NextResponse.json(results);
    } catch (error: unknown) {
      let message = 'Unknown error';
      if (error instanceof Error) message = error.message;
      console.error('NameStone API error:', error);
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  }

  console.log('domain', domain);
  console.log('name', name);
  console.log('exact_match', exact_match);

  // Both domain and name are required for searchNames
  if (!domain || !name) {
    return NextResponse.json(
      { error: 'Both domain and name parameters are required' },
      { status: 400 }
    );
  }

  try {
    const results = await ns.searchNames({
      domain,
      name,
      exact_match: false, // Don't rely on API's exact_match
    });

    // If exact_match is true, filter results to only include exact matches
    const filteredResults = exact_match 
      ? results.filter(result => result.name.toLowerCase() === name.toLowerCase())
      : results;

    console.log('filtered results:', filteredResults);
    return NextResponse.json(filteredResults);
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    console.error('NameStone API error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required parameters
    if (!body.name || !body.domain || !body.address) {
      return NextResponse.json(
        { error: 'Name, domain, and address are required' },
        { status: 400 }
      );
    }

    // we will need to check if the name is available
    const results = await ns.searchNames({
      domain: body.domain,
      name: body.name,
      exact_match: true,
    });
    if (results.length > 0) {
      return NextResponse.json({ error: 'Name is already taken' }, { status: 400 });
    }

    // TODO: we will need to check if the payment ofr this name is received.
    // we will need to create a smart contract that will handle the registration fees.
    // or add a payment gateway to the app. For now we just assume it is paid.
    // For now, we just assume it is paid.  
      
    await ns.setName({
      name: body.name,
      domain: body.domain,
      address: body.address,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    console.error('NameStone API error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 