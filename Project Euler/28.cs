using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		int[,] a = new int [1001,1001];
		a[500,500] = 1;
		a[501,500] = 2;
		a[501,501] = 3;
		int n=500;
		int m=501;
		int z = 4;
		while ( n<=1000 &&m<=1000&&n>=0&&m>=0)
		{
			while (m>=500)
			{
				while( n!=1000-m)
				{
					a[n,m]=z;
					z++;
					n--;
					//Console.WriteLine(n);
				}
				while( m!=n)
				{
					a[n,m]=z;
					z++;
					m--;
					//Console.WriteLine(n);
				}
			}
			while (m<500)
			{
				while( n!=1001-m)
				{
					a[n,m]=z;
					z++;
					n++;
					//Console.WriteLine(n);
				}
				while( m!=n)
				{
					if ( n>1000)
					{
						break;
					}
					a[n,m]=z;
					z++;
					m++;
					//Console.WriteLine(n);
				}
				if ( n>1000)
				{
					break;
				}
			}
			//Console.WriteLine("{0} {1}",m,n);
		}
		Console.WriteLine("qwerqwe");
		int x = 0;
		for (int i = 0 ; i<1001 ; i++)
		{
			for (int j = 0 ; j<1001 ; j++)
			{
				if ( i == j )
				{
					x+=a[i,j];
				} else if (i==1000-j) {
					x+=a[i,j];
				}
			}
		}
		Console.WriteLine(x);
		Console.WriteLine(a[498,498]+a[498,502]+a[499,499]+a[499,501]+a[500,500]+a[501,501]+a[501,499]+a[502,502]+a[502,498]);
	}
}