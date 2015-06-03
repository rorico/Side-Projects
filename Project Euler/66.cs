using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		ulong max = 0;
		for ( ulong i = 1 ; i <= 1000 ; i++ )
		{
			if ( Math.Sqrt(i)%1 == 0)
			{
				continue;
			}
			for ( ulong j = 2 ; ; j++ )
			{
				if ((j*j-1)%i==0&&Math.Sqrt((j*j-1)/i)%1==0)
				{
					if ( j>max)
					{
						Console.WriteLine(i+" " + j);
						max=j;
					}
					break;
				}
			}
		}
				
	}
}