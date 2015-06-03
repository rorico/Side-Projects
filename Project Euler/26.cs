using System;

class dkafldjaf
{
	static void Main()
	{
		int y = 0;
		int z = 0;
		int[] a = new int[10000];
		for (int i = 2 ; i<1000; i++)
		{
			int qwe = 0;
			int x= 1;
			for (int j = 0 ; j<a.Length ; j++)
			{
				x*=10;
				a[j]=x/i;
				x=x-a[j]*i;
				if (x==0)
				{
					qwe=1;
					break;
				}
			//	if (i == 49)
			//	{
			//		Console.Write(a[j]);
			//	}
				
				//Console.Write(a[j]);
			}
			
			//Console.WriteLine("qwe");
			
			if (qwe == 1)
			{
				continue;
			}
			int w=0;
			int asd = 0;
			int k = 41;
			do{
				asd = 0;
				for (; k<a.Length ; )
				{
					if(a[k]==a[40])
					{
						w = k-40;
						//Console.WriteLine("{0} {1}",w,i);
						break;
					}
					k++;
				}
				for( int m = 40 ; m<w+40; m++)
				{
					if (a[m]==a[m+w])
					{
						continue;
					}else{
						asd++;
						//Console.WriteLine("qwerqwer "+i);
						k++;
						break;
					}
				}	
			}while(asd!=0);
			Console.WriteLine("   "+i);
			for (int j = 40 ; j<w+41 ; j++)
			{
				Console.Write("{0} ",a[j]);
			}
			//Console.WriteLine(z);
			if (w>z)
			{
				z=w;
				y=i;
				Console.WriteLine("{0} {1} {2}",y,w,z);
			}
			//Console.WriteLine();
		}		
		Console.WriteLine("\n"+y);
	}		
}