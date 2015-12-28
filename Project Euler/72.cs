using System;

class dkafldjaf
{
	static void Main()
	{
		long z = 0;
		int cnt = 2;
		int[] a= new int[(int)50];
		a[0]=1;
		a[1]=1;
		for ( int i=0; a[cnt-1]<8 ; i++)
		{
			a[cnt]=a[i]+a[i+1];
			cnt++;
			a[cnt]=a[i+1];
			cnt++;
		}
		Console.WriteLine(cnt);
	}
/*		
		int length = 2;
		long size = (long) length*(length-1)/2;
		//long size = (long) Math.Pow(2,5)-1;
		//long size = 55;
		
		Console.WriteLine(size);		
		
		double[] stupidDaniel = new double[size];
		int index = 0;

		for (int i = 1; i < size; i++)
		{
			stupidDaniel[i-1]=1;
		}

		Console.WriteLine((double)stupidDaniel[0] + "d");
		
		for (int j = 1; j<=length; j++)
		{
			for (int i = 1; i<j; i++)
			{
*//*
				int flag = 0;
				for(int k = 0; k <= index; k++)
				{
					if ((double)i/j == stupidDaniel[k])
					{
						flag = k;
						break;
					}
				}
				
				//Console.WriteLine(flag + " flag " + (double)i/j + " i/j " + index + " index");
				
				if(flag == 0)
				{
					stupidDaniel[index] = (double) i/j;
					index++;
					Console.WriteLine(index + " index");
				
					//Array.Sort(stupidDaniel);
					Console.WriteLine((double)stupidDaniel[0]);
				//}
				
			
			}
		}
//		Console.WriteLine(index);
		
		Array.Sort(stupidDaniel);
		//stupidDaniel = stupidDaniel.Sort;
//		Console.WriteLine((double)stupidDaniel[0]);
//		Console.WriteLine("--");
		for (int k = 1; k<size; k++)
		{
//			Console.WriteLine((double)stupidDaniel[k-1]+ " stupidDaniel");
			if(stupidDaniel[k-1] != stupidDaniel[k])
			{
				z++;
//				Console.WriteLine((double)stupidDaniel[k] + " test");
			}
		}
				Console.WriteLine(z+1);		
	}*/
		/*
		for(int i = 2 ; i<=1e4; i++)
		{
			Console.WriteLine(i);
			for (int j = 1 ; j<i ; j++)
			{
				//Console.WriteLine(i + " " + j);
				if (prime(i))
				{
					z++;
					//Console.WriteLine(z);
				}else if (i%j==0&&j!=1){
				}else if (j==1){
					z++;
					//Console.WriteLine(z);

				}
				else{
					for (int k = 2; k<=	j; k++)
					{
						//Console.WriteLine(k + "--");
						if ( i%k==0&&j%k==0)
						{
							break;
						}
						if ( k==j)
						{
							z++;
							//Console.WriteLine(z);
							break;
						}
					}
				}
			}	
		}
		Console.WriteLine(z);
	}
	
		static bool prime(int x)
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

	}*/
}