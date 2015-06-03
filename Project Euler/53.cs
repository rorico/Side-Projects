using System;

class dkafldjaf
{
	static void Main()
	{
		double num = 1;
		int sum = 0;
		for ( int i = 1 ; i <= 100 ; i++)
		{
			for ( int j = 1 ; j < i ; j++)
			{
				num = 1;
				for ( double k = i ; k>j ; k--)
				{
					num*=k;
					if ( num>1e6)
					{
						double hold = num;
						for ( int m = i-j ; m>=1 ; m--)
						{
							hold/=m;
						}
						if (hold>1e6)
						{
							sum++;
							Console.Write(i);
							Console.Write(" " );
							Console.WriteLine(j);
							break;
						}
					}
				}
			}
		}
		Console.WriteLine(sum);
	}
}