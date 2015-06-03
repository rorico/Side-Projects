using System;

class dkafldjaf
{
	static void Main()
	{
		int y = 0;
		int k = 0;
		double[] x = new double[10000];
		for (double i = 2 ; i<= 100 ; i++)
		{
			for (double j = 2 ; j<= 100 ; j++)
			{
				x[k] = Math.Pow(i,j);
				for (int m = 0 ; m<k ; m++)
				{
					if (m==k-1||k==0)
					{
						//Console.WriteLine(x[k]);
						y++;
					}
					if (x[k]==x[m])
					{
						Console.WriteLine(x[k]);
						break;
					}

				}
				k++;
			}
		}
		Console.WriteLine(y);
	}		
}