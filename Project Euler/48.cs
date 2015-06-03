using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		int[] a = new int[15];
		a[0]=1;
		for (int i = 1; i<15 ; i++)
		{
		a[i]=0;
		}
		for (int m = 2 ; m <= 999 ; m++)
		{
			int[] b = new int [15];
			b[0]=1;
			for (int n = 1 ; n<=m ; n++)
			{
				for (int p = 14 ; p>=0; p--)
				{
					if (b[p]==0)
					{
						continue;
					}
					for(int k = 14; k>=0;k--)
					{
						if(b[k]>=10)
						{
							b[k+1]=b[k+1]+(b[k]/10);
							b[k]=b[k]%10;
						}
						b[13]=0;
						b[14]=0;
					}
					int x = b[p]*m;
					if (x>=10)
					{
						b[p+1]=b[p+1]+x/10;
						b[p]=x%10;
					}else{
						b[p]=x;
					}
					b[13]=0;
					b[14]=0;
					for (int qwe = 0; qwe<4; qwe++)
					{
						for(int k = 14; k>=0;k--)
						{
							if(b[k]>=10)
							{
								b[k+1]=b[k+1]+(b[k]/10);
								b[k]=b[k]%10;
							}
							a[13]=0;
							a[14]=0;
						}	
					}
				}
			}
			for(int ewq = 0 ; ewq<10 ; ewq++)
			{
			//	Console.Write(b[ewq]);
			}
			for (int j = 14 ; j>=0; j--)
			{
				for(int k = 14; k>=0;k--)
				{
					if(a[k]>=10)
					{
						a[k+1]=a[k+1]+(a[k]/10);
						a[k]=a[k]%10;
					}
					a[13]=0;
					a[14]=0;
				}
				
				int x = b[j]+a[j];

				if (x>=10)
				{
					a[j+1]=a[j+1]+(x/10);
					a[j]=x%10;
				}else{
					a[j]=x;
				}
				for (int qwe = 0; qwe<4; qwe++)
				{
					for(int k = 14; k>=0;k--)
					{
						if(a[k]>=10)
						{
							a[k+1]=a[k+1]+(a[k]/10);
							a[k]=a[k]%10;
						}
						a[13]=0;
						a[14]=0;
					}	
				}
							for(int ewq = 0 ; ewq<10 ; ewq++)
			{
			//	Console.Write(a[ewq]);
			}
					
			
	//				for(int j = 50;j>=0;j--)
		//			{
			//			Console.Write(a[j]);
				//	}
					//Console.WriteLine();
			}
		}
		for(int i = 0 ; i<10 ; i++)
		{
			Console.Write(a[i]);
		}
	}
}