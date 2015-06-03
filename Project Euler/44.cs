using System;
using System.IO;

class dkafldjaf
{
	const string intensityFile = "words.txt"; 
	static void Main()
	{
		int cnt = 0;
		int[] x = new int[10000];
		for (int i = 1 ; i<=x.Length ; i++)
		{
			x[i-1]=i*(3*i-1)/2;
			Console.WriteLine(x[i-1]);
		}
		
		for (int i = 0 ; i<x.Length ; i++)
		{
			for (int j = 0 ; j<i ; j++)
			{
				for (int k = 0 ; k<x.Length ; k++)
				{
					if (x[i]+x[j]==x[k])
					{
						for (int m = 0 ; m<x.Length ; m++)
						{
							if (x[i]-x[j]==x[m])
							{
								Console.WriteLine("{0} {1}",x[i],x[j]);
								Console.WriteLine(x[i]-x[j])
								break;
							}
						}
					}
				}
			}
		}
	}
}