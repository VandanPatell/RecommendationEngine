c
c     (C) Rasmus Munk Larsen, Stanford University, 2004
c

c
c****************************************************************************
C     This simple version of MGS is faster on Pentium machines.

      subroutine dmgs(n,k,V,ldv,vnew,index)
      implicit none
      include 'stat.h'
      integer n,k,ldv,index(*)
      double precision V(ldv,*),vnew(*)
      integer i,j,p,q,iblck
      double precision s

c     Check for quick return
      if ((k.le.0).or.(n.le.0)) return
      iblck = 1
      p = index(iblck)
      q = index(iblck+1)
      do while(p.le.k .and.p .gt.0 .and. p.le.q)
         ndot = ndot + (q-p+1)
         do i=p,q
            s = 0d0
CDIR$ LOOP COUNT(10000)
#ifdef _OPENMP
c$OMP PARALLEL DO reduction(+:s)
#endif
            do j=1,n
               s = s + V(j,i)*vnew(j)
            enddo
CDIR$ LOOP COUNT(10000)
#ifdef _OPENMP
c$OMP PARALLEL DO firstprivate(s)
#endif
            do j=1,n
               vnew(j) = vnew(j) - s*V(j,i)
            enddo
         enddo
         iblck = iblck + 2
         p = index(iblck)
         q = index(iblck+1)
      enddo
      end
