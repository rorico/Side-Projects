using System;

class dkafldjaf
{
	static void Main()
	{
		int b = 0;
		int w = 0;
		long y = 0;
		long z = 0;
		long[] a = new long [1229];
		for (int i = 2; i<=1e4 ; i++)
		{
			if (prime(i))
			{
				a[w]=i;
				w++;
			}
		}
		Console.WriteLine(w);
		for (int i = 0 ; i <a.Length ; i++)
		{
			long x = 0;
			for (int j = 0 ; j< a.Length-i ;j++)
			{
				
				x+=a[(j+i)];
				if (x>1e3)
				{
					break;
				}
//				if (j<20)
//				{
				//Console.WriteLine(x);
//				}
				if (prime(x))
				{
					y=x;
					if (j>b)
					{
						z=y;
						b=j;
						//Console.WriteLine();
						//Console.WriteLine(z);
					}
				}
			}
			Console.WriteLine();
		}
		Console.WriteLine(z);
	}		
	static bool prime(double x)
	{
		if (x<2)
		{
			return false;
		}
		for(int i = 2; i<= (int)Math.Sqrt(x) ; i++)
		{
			if (x%i==0)
			{
				return false;
			}
		}
		return true;
	}
}