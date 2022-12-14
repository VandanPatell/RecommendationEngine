c
c     (C) Rasmus Munk Larsen, Stanford University, 2000, 2004
c
c
c****************************************************************************
c
C This version of MGS is faster on MIPS, UltraSPARC and Itanium.
c Probably because it exposes possibility of using fused multiply-add
c instructions in the inner loop(?).

      subroutine zmgs(n,k,V,ldv,vnew,index)
c     
c     Modified Gram-Schmidt orthogonalization:
c     Orthogalizes vnew against the k vectors in V by the
c     iterative process     
c     
c     FOR i= [s_1:e_1 s_2:e_2 ... s_l:e_l] DO          
c       vnew = vnew - DOT( V(:,i), vnew ) * V(:,i) 
c
c     %-----------%
c     | Arguments |
c     %-----------%
      implicit none
      include 'stat.h'
      integer n,k,ldv,index(*)
      complex*16 V(ldv,*),vnew(*)
c     %------------%
c     | Parameters |
c     %------------%
      double precision one, zero
      parameter(one = 1.0, zero = 0.0)
c     %-----------------%
c     | Local variables |
c     %-----------------%
      integer iblck,i,j,p,q
      complex*16 vn0,newcoef,coef
c     %--------------------%
c     | External Functions |
c     %--------------------%
#ifdef _OPENMP
      integer  omp_get_max_threads
      external  omp_get_max_threads

      if (omp_get_max_threads().gt.1) then
         call pzmgs(n,k,V,ldv,vnew,index)
         return
      endif
#endif

c     Check for quick return
      if ((k.le.0).or.(n.le.0)) return
      iblck = 1
      p = index(iblck)
      q = index(iblck+1)
      do while(p.le.k .and.p .gt.0 .and. p.le.q)
c     Select the next block of columns from V
         ndot = ndot + (q-p+1)
         coef = dcmplx(zero,zero)
CDIR$ LOOP COUNT(10000)
         do j=1,n
            coef = coef + dconjg(V(j,p))*vnew(j)
         enddo         
c   interleaved (software pipelined) loops improve performance
c   of inner loop on machines with fused multiply-add.
         do i=p+1,q
            newcoef = dcmplx(zero,zero)
CDIR$ IVDEP
CDIR$ LOOP COUNT(10000)
            do j=1,n
               vn0 = vnew(j) - coef*V(j,i-1)
               newcoef = newcoef + dconjg(V(j,i))*vn0 
               vnew(j) = vn0
            enddo
            coef = newcoef
         enddo
CDIR$ LOOP COUNT(10000)
         do j=1,n
            vnew(j) = vnew(j) - coef*V(j,q)
         enddo
         iblck = iblck + 2
         p = index(iblck)
         q = index(iblck+1)
      enddo
      end


      subroutine pzmgs(n,k,V,ldv,vnew,index)
c     
c     Modified Gram-Schmidt orthogonalization:
c     Orthogalizes vnew against the k vectors in V by the
c     iterative process     
c     
c     FOR i= [s_1:e_1 s_2:e_2 ... s_l:e_l] DO          
c       vnew = vnew - DOT( V(:,i), vnew ) * V(:,i) 
c
c     %-----------%
c     | Arguments |
c     %-----------%
      implicit none
      include 'stat.h'
      integer n,k,ldv,index(*)
      complex*16 V(ldv,*),vnew(*)
c     %------------%
c     | Parameters |
c     %------------%
      double precision one, zero
      parameter(one = 1.0, zero = 0.0)
c     %-----------------%
c     | Local variables |
c     %-----------------%
      integer iblck,i,j,p,q
      complex*16 vn0,newcoef,coef

c     Check for quick return
      if ((k.le.0).or.(n.le.0)) return
      iblck = 1
      p = index(iblck)
      q = index(iblck+1)
      do while(p.le.k .and.p .gt.0 .and. p.le.q)
c     Select the next block of columns from V
         ndot = ndot + (q-p+1)
         coef = dcmplx(zero,zero)
CDIR$ LOOP COUNT(10000)
#ifdef _OPENMP
c$OMP PARALLEL DO reduction(+:coef) firstprivate(p) schedule(static) 
#endif
         do j=1,n
            coef = coef + dconjg(V(j,p))*vnew(j)
         enddo         
c   interleaved (software pipelined) loops improve performance
c   of inner loop on machines with fused multiply-add.
         do i=p+1,q
            newcoef = dcmplx(zero,zero)
CDIR$ IVDEP
CDIR$ LOOP COUNT(10000)
#ifdef _OPENMP
c$OMP PARALLEL DO reduction(+:newcoef) private(vn0) firstprivate(i,coef) 
c$OMP& schedule(static) 
#endif
            do j=1,n
               vn0 = vnew(j) - coef*V(j,i-1)
               newcoef = newcoef + dconjg(V(j,i))*vn0 
               vnew(j) = vn0
            enddo
            coef = newcoef
         enddo
CDIR$ LOOP COUNT(10000)
#ifdef _OPENMP
c$OMP PARALLEL DO firstprivate(coef,q) schedule(static)
#endif
         do j=1,n
            vnew(j) = vnew(j) - coef*V(j,q)
         enddo
         iblck = iblck + 2
         p = index(iblck)
         q = index(iblck+1)
      enddo
      end
