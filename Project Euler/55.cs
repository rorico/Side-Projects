using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
	//	int[] d = new int[30];
	//	c(978155,d);
	//	for ( int i = 0 ; i<d.Length ; i++)
	//	{
	//		Console.Write(d[i]+" ");
	//	}
	//	a(d);
	//	for ( int i = 0 ; i<d.Length ; i++)
	//	{
	//		Console.Write(d[i]+" ");
	//	}
		
		int cnt = 0;
		int[] b = new int [30];
		for ( int i = 1 ; i<10000 ; i++)
		{
			c(i,b);
	//		if ( p(b))
	//		{
	//			continue;
	//		}
			int[] x = b;
			for ( int j = 0 ; j<=50 ; j++)
			{
				if ( j == 50)
				{
				//	Console.WriteLine("{0} {1}",i,j);
					cnt++;
				}
				a(x);
				for ( int k = 0 ; k<x.Length ; k++)
				{
					Console.Write(x[k]+" ");
				}
				Console.WriteLine();
	//			if ( x >1e10 )
	//			{
	//				Console.WriteLine(x);
	//			}
				if ( p(x))
				{
				
					Console.WriteLine("{0} {1}",i,j);
					break;
				}
				
			}
		}
		Console.WriteLine(cnt);
		
	}
	static bool p( int[] a )
	{/*
		string s = Convert.ToString(x);
		for ( int i = 0 ; i <= s.Length/2 ; i++)
		{
			if ( s[i]!=s[s.Length-i-1] )
			{
				return false;
			}
		}
		return true;*/ 	
		int cnt = 0;
		for ( int i = a.Length-1 ; i>=0 ; i--)
		{
			if ( a[i]!=0)
			{
				cnt=i+1;
				break;
			}
		}
		for ( int i = 0 ; i <= cnt/2 ; i++)
		{
			if ( a[i]!=a[cnt-i-1] )
			{
				return false;
			}
		}
		return true;
	}
	static void a( int[] a )
	{/*
		string s = Convert.ToString(x);
		ulong y = 0;
		for ( int i = 0 ; i<s.Length ; i++)
		{
			ulong z = (ulong) Char.GetNumericValue(s[i]);
			for ( int j = 0 ; j<i; j++)
			{
				z*=10;
			}
			y+=z;
		}
		return x+y;*/
		int cnt = 0;
		for ( int i = a.Length-1 ; i>=0 ; i--)
		{
			if ( a[i]!=0)
			{
				cnt=i+1;
				break;
			}
		}
		int[]b = new int[a.Length];
		for ( int i = 0 ; i < cnt ; i++)
		{
			b[i]=a[cnt-i-1];
		}
		for ( int i = cnt-1 ; i >=0 ; i--)
		{
			int x=a[i]+b[i];
			if ( x<10 )
			{
				a[i] = x;
			} else {
				if ( a[i+1]!=9)
				{
					a[i+1] = a[i+1]+x/10;
					a[i] = x-10;
				} else {
					if ( a[i+2]!=9)
					{
						a[i+2] = a[i+2]+1;
						a[i+1] = 0;
						a[i] = x-10;
					} else {
						if ( a[i+3]!=9)
						{
							a[i+3] = a[i+3]+1;
							a[i+2] = 0;
							a[i+1] = 0;
							a[i] = x-10;
						} else {		
							if ( a[i+4]!=9)
							{
								a[i+4] = a[i+4]+1;
								a[i+3] = 0;
								a[i+2] = 0;
								a[i+1] = 0;
								a[i] = x-10;
							} else {	
								a[i+5] = a[i+5]+1;
								a[i+4] = 0;
								a[i+3] = 0;
								a[i+2] = 0;
								a[i+1] = 0;
								a[i] = x-10;
							}
						}
					}
					
				}
			}
		}
		
	}
	static void c( int x , int[] a)
	{
		string s = Convert.ToString(x);
		for ( int i = s.Length-1 ; i>=0 ; i--)
		{
			a[i] = (int) Char.GetNumericValue(s[s.Length-1-i]);
		}
		for ( int i = s.Length ; i<a.Length ; i++)
		{
			a[i] = 0 ;
		}
	}
}