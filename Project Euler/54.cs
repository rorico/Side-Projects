using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
	//	string[] p = {"10","A","K","Q","J","9","8","7","2","T"};
	//	Array.Sort(p);
	//	foreach ( string b in p )
	//	{
	//		Console.WriteLine(b);
	//	}
		int cnt1 = 0;
		string[][] x = new string[1000][];
		int cnt = 0;
		StreamReader sr = new StreamReader("poker.txt");
		while(!sr.EndOfStream)
		{
			string line = sr.ReadLine( );
			x[cnt] = line.Split(' ');
			cnt++;
		}
		sr.Close();
		foreach ( string[] a in x )
		{
			string[] p1 = new string[5];
			string[] p2 = new string[5];
			for ( int i = 0 ; i<5 ; i++)
			{
				p1[i] = a[i];
			}
			for ( int i = 0 ; i<5 ; i++)
			{
				p1[i] = a[i+5];
			}
			
			if ( RF(p1)==1&&RF(p2)!=1)
			{
				Console.WriteLine("qwerw");
				cnt1++;
				break;
			}
			
			/*
			if ( SF(p1)==1&&SF(p2)!=1)
			{
			Console.WriteLine("qwer");
				cnt1++;
				break;
			} else if ( SF(p1)==1&&SF(p2)==1&&compare(p1,p2)) {
				cnt1++;
				break;
			}*/
			Console.WriteLine("qweeqwrqwr");
				
		}
		Console.WriteLine(cnt1);
	}
	static int RF( string[] p1 )
	{
		if ( p1[0][1]==p1[1][1]&&p1[1][1]==p1[2][1]&&p1[2][1]==p1[3][1]&&p1[3][1]==p1[4][1])
		{} else{
			return 0;
		}
		char[] x = {'A','J','K','Q','T'};
		Array.Sort(p1);
		for ( int i = 0 ; i<5 ; i++)
		{
			if (p1[i][0] != x[i])
			{
				return 0;
			}
		}
		return 1;
	}
	static int SF( string[] p1 )
	{
		if ( p1[0][1]==p1[1][1]&&p1[1][1]==p1[2][1]&&p1[2][1]==p1[3][1]&&p1[3][1]==p1[4][1])
		{
			return 1;
		} else{
			return 0;
		}
	}
	static bool compare( string[] p1, string[] p2 )
	{	
		if (highest(p1)>highest(p2))
		{
			return true;
		} else {
			return false;
		}
	}
	static int highest ( string[] p1 )
	{
		for ( int i = 0 ; i <5 ; i++)
		{
			if (p1[i][0] == 'A')
			{
				return 14;
			}
		}
		for ( int i = 0 ; i <5 ; i++)
		{
			if (p1[i][0] == 'K')
			{
				return 13;
			}
		}
		for ( int i = 0 ; i <5 ; i++)
		{
			if (p1[i][0] == 'Q')
			{
				return 12;
			}
		}
		for ( int i = 0 ; i <5 ; i++)
		{
			if (p1[i][0] == 'J')
			{
				return 11;
			}
		}
		for ( int i = 0 ; i <5 ; i++)
		{
			if (p1[i][0] == 'T')
			{
				return 10;
			}
		}
		Array.Sort(p1);
		return (int) Char.GetNumericValue(p1[4][0]);
	}
}