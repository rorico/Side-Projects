using System;

class dkafldjaf
{
	static void Main()
	{
		int sum = 2 ;
		int[] a = new int[1000];
		a[0]=1;
		for (int i = 1; i<1000 ; i++)
		{
		a[i]=0;
		}
		int[] b = new int[1000];
		b[0]=1;
		for (int i = 1; i<1000 ; i++)
		{
		b[i]=0;
		}
		int[] c = new int[1000];
		c[0]=1;
		for (int i = 1; i<1000 ; i++)
		{
		c[i]=0;
		}
		while (a[999]==0)
		{
			for (int j = 999 ; j>=0; j--)
			{
				if (a[j]==0&&b[j]==0&&c[j]==0)
				{
					continue;
				}
				for(int k = 999; k>=0;k--)
				{
					if(a[k]>=10)
					{
						a[k+1]=a[k+1]+(a[k]/10);
						a[k]=a[k]%10;
					}
				}
					
				int x = a[j]+b[j];
				//Console.WriteLine("{0} {1}",x,a[j]);
				c[j]=b[j];
				b[j]=a[j];
				if (x>=10)
				{
					a[j+1]=a[j+1]+(x/10);
					a[j]=x%10;
				}else{
					a[j]=x;
				}
				for (int m = 0; m<4; m++)
				{
					for(int k = 999; k>=0;k--)
					{
						if(a[k]>=10)
						{
							a[k+1]=a[k+1]+(a[k]/10);
							a[k]=a[k]%10;
						}
					}	
				}
					
			}
			sum++;
		}
		for(int i = 0 ; i <1000 ; i++)
		{
			Console.Write("{0} ",a[i]);
		}
		Console.WriteLine(sum);
		


	}		
}