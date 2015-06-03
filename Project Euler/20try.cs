using System;

class dkafldjaf
{
	static void Main()
	{
		int sum = 0 ;
		int[] a = new int[300];
		a[0]=1;
		for (int i = 1; i<300 ; i++)
		{
		a[i]=0;
		}
		for (int i = 2; i<=100; i++)
		{
			for (int j = 298 ; j>=0; j--)
			{
				if (a[j]==0)
				{
					continue;
				}
				for(int k = 298; k>=0;k--)
				{
		//			if (a[k]>=100)
		//			{
		//				a[k+2]=a[k+2]+(a[k]/100);
		//				a[k+1]=a[k+1]+(a[k]%100)/10;
		//				a[k]=a[k]%10;
		//			}
					if(a[k]>=10)
					{
						a[k+1]=a[k+1]+(a[k]/10);
						a[k]=a[k]%10;
					}
				}
					
				int x = i*a[j];
				//Console.WriteLine("{0} {1}",x,a[j]);
		//		if (x>=100)
		//		{
		//			a[j+2]=a[j+2]+(x/100);
		//			a[j+1]=a[j+1]+(x%100)/10;
		//			a[j]=x%10;
		//		}	
				if (x>=10)
				{
					a[j+1]=a[j+1]+(x/10);
					a[j]=x%10;
				}else{
					a[j]=x;
				}
				for (int m = 0; m<4; m++)
				{
					for(int k = 298; k>=0;k--)
					{
		//				if (a[k]>=100)
		//				{
		//					a[k+2]=a[k+2]+(a[k]/100);
		//					a[k+1]=a[k+1]+(a[k]%100)/10;
		//					a[k]=a[k]%10;
		//				}
						if(a[k]>=10)
						{
							a[k+1]=a[k+1]+(a[k]/10);
							a[k]=a[k]%10;
						}
					}	
				}
					
			}
			for(int j = 50;j>=0;j--)
			{
				Console.Write(a[j]);
			}
			Console.WriteLine();
		}
		for(int i = 0; i<4 ; i++)
		{
			for (int j = 299 ; j>=0; j--)
			{
				if (a[j]==0)
				{
					continue;
				}
				if(a[j]>=10)
				{
					a[j+1]=a[j+1]+(a[j]/10);
					a[j]=a[j]%10;
				}
			}
		}
		for (int i = 0 ; i<300; i++)
		{
			sum+=a[i];
			//if(a[i]!=0)
			//{
			Console.Write("{0} ",a[i]);
			//	}
		}
		Console.WriteLine(sum);

//		Console.WriteLine(x+11);
	}		
}