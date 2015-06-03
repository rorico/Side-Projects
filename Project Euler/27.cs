using System;

class dkafldjaf
{
	static void Main()
	{
		int x = 0;
		int y = 0;
		for (int j = -1000 ; j<=1000 ; j++)
		{
			for (int k = -1000 ; k<1000 ; k++)
			{
				if (prime(k))
				{
					int w = 0;
					for (int i = 0 ; ; i++)
					{
						if (prime(i*i+j*i+k))
						{
							w++;
						}else{
							break;
						}
					}
					if (w>x)
					{
						x=w;
						y=j*k;
					}
				}	
			}
		}
		Console.WriteLine("{0} {1}",x,y);
	}		
	static bool prime(int x)
	{
		double y=(double)x;
		if (x<2)
		{
			return false;
		}
		for(int i = 2; i<= (int)Math.Sqrt(y) ; i++)
		{
			if (x%i==0)
			{
				return false;
			}
		}
		return true;
	}
}