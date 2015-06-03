using System;

class dkafldjaf
{
	static void Main()
	{
		long c = 0;
		long b = 0;
		long p = 0;
		long z = 0;
		long y = 0;
		for (long i = 2 ; i<= 28123 ; i++)
		{
			long a = 0;
			for (long j = 1 ; j <= i/2 ; j++)
			{
				if (i%j==0)
				{
					a+=j;
				}
			}
			//Console.WriteLine(a);
			if (a>i)
			{
				y++;
			}
				
		
		}
		
		long[] x = new long[y+1];
		for (long i = 2 ; c<= 28123 ; i++)
		{
			long a = 0;
			for (long j = 1 ; j <= i/2 ; j++)
			{
				if (i%j==0)
				{
					a+=j;
				}
			}
			//Console.WriteLine(a);
			if (a>i)
			{
				x[z]=i;
				c=i;
				z++;
			}
				
		
		}
		for (long i = 1 ; i<= 28123 ; i++)
		{
			b=0;
			for (long j = 0 ; j < x.Length ; j++) 
			{
				for (long k = 0 ; k < x.Length ; k++)
				{
					if ((x[j]+x[k])>i)
					{
						break;
					}
					if ((x[j]+x[k])==i)
					{
						b=1;
						//Console.WriteLine(x[j]+" "+x[k]+" "+i);
						break;
					}
				}
				if (b==1)
				{
					break;
				}
			}
			if (b==0)
			{
				p+=i;
				Console.WriteLine(i);
			}
		}
			
		Console.WriteLine(p);
	}		
}