using System;
using System.IO;

class dkafldjaf
{
	const string intensityFile = "words.txt"; 
	static void Main()
	{
		int cnt = 0;
		int[] x = new int[100000];
		int w = 1; 
		x[0]=2;
		for (int i = 1 ; i<x.Length ; i++)
		{
			w++;
			w++;
			if (prime(w))
			{
				x[i]=w;
			}else{
				i--;
			}
		}
		
		for (int i = 1 ; i<1e7 ; i+=2)
		{
			if (prime(i)==false)
			{
				for (int j = 0 ; j<x.Length ; j++)
				{
					double z = Math.Sqrt((i-x[j])/2);
					int y = (int) z;
						if (x[j]>i)
						{
							Console.WriteLine(i);
							break;
						}
						if (z==y)
						{
							break;
						}
						//if (j==x.Length-1&&j==1e6-1)
						//{
						//	Console.WriteLine(i);
						//}
					
				}
			}
		}
	}
	static bool prime(int x)
	{
		if (x<2)
		{
			return true;
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