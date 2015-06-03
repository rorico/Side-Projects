using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		int max = 0;
		int[] x = new int[200];	
		for ( int i = 1 ; i < 100 ; i++ )
		{
			//Console.WriteLine("qwer");
			for ( int j = 1 ; j < 101 ; j++ )
			{
				//Console.WriteLine("qwer");
				c(i,x);
				int sum = 0;
				for ( int k = 1 ; k < j ; k++ )
				{
					//Console.WriteLine("qwer");
					for ( int m = x.Length-1 ; m>=0 ; m-- )
					{
						x[m]*=i;
						a(x,m);
					}
				}
				for ( int k = 0 ; k < x.Length ; k++ )
				{
					sum+=x[k];
					//Console.Write(x[k]);
				}
				//Console.WriteLine();
				if ( sum>max )
				{
					max = sum;
					Console.Write(i+" " + j + " ");
						Console.WriteLine(max);
				}
			}
		}
		Console.WriteLine(max);	
				
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
	static void a( int[] x , int y )
	{
		string s = Convert.ToString(x[y]);
		x[y] = x[y]%10;
		for ( int i = 1 ; i < s.Length; i++)
		{
			x[y+i] = x[y+i]+ (int) Char.GetNumericValue(s[s.Length-1-i]);
			d(x,y+i);
		}
	}
	static void d( int[] x , int y )
	{
		if ( x[y] >= 10 )
		{
			x[y+1] = x[y+1] + x[y]/10;
			x[y] = x[y]%10;
			y++;
			d(x,y);
		}
	}
}