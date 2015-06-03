using System;

class dkafldjaf
{
	static void Main()
	{
		int counter = 0;
		int number = 0;
		for (int i = 3 ; counter!=4 ; i++)
		{
		int[] a = new int [4];
		int x = i;
			if (prime(x))
			{
				counter=0;
			}
			while(prime(x)==false&&x!=1)
			{
				int count = 0;
				for (int j = 2; j<=x;j++)
				{
					if (x%j==0)
					{

						for (int k = 0; k<4 ; k++)
						{
							if (a[k]==j)
							{	
								count--;
								break;
							}
							if (a[k]==0)
							{
								a[k]=j;
								break;
							}
						}
						count++;
						if (count>4)
						{
							break;
						}
						x=x/j;
						//Console.WriteLine(j);
						j--;
					}
				}
				if (count==4)
				{
					counter++;
					//Console.WriteLine("{0} {1} {2} {3}",i,a[0],a[1],a[2]);
				}else{
					counter=0;
				}
			}
			if (counter==4)
			{
				Console.WriteLine(i);
			}
		}
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