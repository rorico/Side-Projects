using System;

class dkafldjaf
{
	static void Main()
	{
		int x = 0;
		int z = 0;
		int l = 0;
		for ( int m = 1 ; m <= 1000 ; m++)
		{
			l=0;
			for (int i = 1; i<=m ; i++)
			{
				for ( int j = 1 ; j<=m ; j++)
				{
					for ( int k = 1 ; k<=m ; k++)
					{
						if ( i*i+j*j==k*k)
						{
							if (i+j+k==m)
							{
								l++;
								if (l>x)
								{
									x=l;
									z=m;
									Console.WriteLine("{0} {1} {2} {3} {4}",m,x,i,j,k);	
								}
							}
							
						}

					}
				}
			}
		}
		Console.WriteLine(z);
	}		
}