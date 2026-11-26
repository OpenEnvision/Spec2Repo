# Spec2Repo: Benchmarking Repository Construction against Behavioral Specifications

<p align="center">
  <a href="https://openenvision.org/Spec2Repo/"><b>🌐 Project Page & Leaderboard</b></a> ·
  <a href="https://openenvision.org/Spec2Repo/Spec2Repo.pdf"><b>📄 Paper (PDF)</b></a> ·
  <a href="https://doi.org/10/hct22n"><b>🔗 DOI (10.13140/RG.2.2.35899.86567)</b></a>
</p>

## Overview

**Spec2Repo** is a benchmark of **150 repository-construction tasks** across five programming languages (Python, TypeScript, Rust, Java, and Go). An agent receives only a user-facing behavioral specification and an empty workspace, and must build an installable or buildable repository from scratch. Submissions are evaluated by **16,597 hidden tests** grouped into **1,962 specified capabilities** that interact with the repository strictly through its declared public interface.

- **150 tasks** across Python (67), TypeScript (28), Rust (24), Java (17), and Go (14), with **16,597 hidden tests** and **1,962 specified capabilities**.
- **Functional Completion Rate (FCR):** Credits a capability only when all of its atomic and integration tests pass.
- **Key Findings:** Across six frontier models and two scaffolds (1,800 isolated container runs), the strongest configuration (**Claude Opus 5 + mini-swe-agent**) delivers **73.2% FCR** and resolves **8.7% of tasks (13/150)**.
- The Spec2Repo tasks and hidden test suites are not publicly released. To evaluate a model or scaffold on Spec2Repo, contact `frostlin2005@gmail.com`.

## Citation

If you find Spec2Repo useful in your research, please cite our paper:

```bibtex
@article{xiao2026spec2repo,
  title   = {Spec2Repo: Benchmarking Repository Construction against Behavioral Specifications},
  author  = {Xiao, Chuan and Jiao, Zhengbo and Cheng, Yiming and Tian, Juanxi and
             Xu, Weiwei and He, Bingxiang and Xian, Hongyu and Chen, Zhikang and
             Cui, Chenhang and Huang, Rui and Hou, Jiadong and Li, Zhiqian and
             Liu, Junming and Chen, Tailai and Tang, Yuxin and Zhou, Yanghao and
             Ni, Jiahao and Li, Yangfu and Zhou, Yanhan and Liu, Chenyu and
             Zhou, Zijian and Zhang, Kaijie and Tang, Weidong and Yan, Xin and
             Wang, Qinglong and Pu, Tianle and Jing, Lingxiao and Zhu, Bofan and
             Zhang, Zifan and Jiang, Tianyi and Wang, Baojie and Fan, Haizhao and
             Cui, Fushun and Xie, Qinlei and Hua, De and Zhang, Chenxu and
             Shen, Jianghan and Li, Haitian and Luo, Mingyu and Rong, Shanyu and
             Li, Wanhua and Guo, Zhijiang and Chen, Mouxiang and Wang, Qi and
             Zhang, Jingyuan and Wang, Wei and Zhao, Bing},
  year    = {2026},
  doi     = {10.13140/RG.2.2.35899.86567},
  url     = {https://openenvision.org/Spec2Repo/}
}
```
